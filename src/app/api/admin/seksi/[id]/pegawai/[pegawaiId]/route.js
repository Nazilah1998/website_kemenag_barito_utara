import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { uploadBase64ImageToSupabase, removeSupabaseFileByPublicUrl, isCmsStoragePublicUrl } from "@/lib/storage-media";
import { cleanString } from "@/lib/validation";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle";
import { seksi, pegawai_seksi } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logWarn, logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

function toText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function PUT(request, context) {
  const auth = await validateAdmin({ permission: PERMISSIONS.SEKSI_MANAGE });
  if (!auth.ok) return auth.response;

  try {
    const params = await context.params;
    const seksiId = params?.id;
    const pegawaiId = params?.pegawaiId;

    if (!seksiId || !pegawaiId) {
      return apiResponse({ message: "Parameter tidak lengkap." }, 400);
    }

    const [seksiData] = await db
      .select()
      .from(seksi)
      .where(eq(seksi.id, seksiId))
      .limit(1);

    if (!seksiData) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    const [existing] = await db
      .select()
      .from(pegawai_seksi)
      .where(eq(pegawai_seksi.id, pegawaiId))
      .limit(1);

    if (!existing || existing.seksi_id !== seksiId) {
      return apiResponse({ message: "Staf pegawai tidak ditemukan di seksi ini." }, 404);
    }

    const body = await request.json().catch(() => ({}));
    const nama = toText(body?.nama, "");
    const nip = toText(body?.nip, "");
    const jabatan = toText(body?.jabatan, "");
    const sort_order = toNumber(body?.sort_order, existing.sort_order);
    const fotoRaw = toText(body?.foto, "");
    const fotoBase64 = cleanString(body?.foto_base64, 10_000_000);
    const fotoName = toText(body?.foto_name, "pegawai");
    const foto_y = body?.foto_y !== undefined ? parseInt(body.foto_y, 10) : existing.foto_y;

    if (!nama) {
      return apiResponse({ message: "Nama pegawai wajib diisi." }, 400);
    }
    if (!jabatan) {
      return apiResponse({ message: "Jabatan pegawai wajib diisi." }, 400);
    }

    let finalFoto = fotoRaw || existing.foto;

    // Handle foto pegawai upload to Supabase Storage
    if (fotoBase64) {
      const uploaded = await uploadBase64ImageToSupabase({
        dataUrl: fotoBase64,
        folder: "pegawai",
        fileNameStem: fotoName || `pegawai-${pegawaiId}`,
      });
      finalFoto = uploaded?.publicUrl || "";

      // Delete old photo if it is hosted in our storage
      if (existing.foto && isCmsStoragePublicUrl(existing.foto)) {
        try {
          await removeSupabaseFileByPublicUrl(existing.foto);
        } catch (e) {
          logWarn("pegawai_id_delete_old_photo_warn", { error: e?.message });
        }
      }
    }

    const [updated] = await db
      .update(pegawai_seksi)
      .set({
        nama,
        nip: nip || null,
        jabatan,
        foto: finalFoto || null,
        foto_y: Number.isInteger(foto_y) ? foto_y : 50,
        sort_order,
      })
      .where(eq(pegawai_seksi.id, pegawaiId))
      .returning();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.SETTINGS,
      entityId: pegawaiId,
      summary: `Memperbarui staf pegawai seksi (${seksiData.judul}): ${nama}`,
      before: existing,
      after: updated,
      request,
    });

    // Revalidate public routes
    revalidatePath("/");
    revalidatePath("/informasi/struktur-organisasi");
    revalidatePath(`/layanan/${seksiData.slug}`);

    return apiResponse({
      message: "Data staf pegawai berhasil diperbarui.",
      item: updated
    });
  } catch (error) {
    logError("pegawai_seksi_id_put_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Gagal memperbarui staf pegawai." },
      500,
    );
  }
}

export async function DELETE(request, context) {
  const auth = await validateAdmin({ permission: PERMISSIONS.SEKSI_MANAGE });
  if (!auth.ok) return auth.response;

  try {
    const params = await context.params;
    const seksiId = params?.id;
    const pegawaiId = params?.pegawaiId;

    if (!seksiId || !pegawaiId) {
      return apiResponse({ message: "Parameter tidak lengkap." }, 400);
    }

    const [seksiData] = await db
      .select()
      .from(seksi)
      .where(eq(seksi.id, seksiId))
      .limit(1);

    if (!seksiData) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    const [existing] = await db
      .select()
      .from(pegawai_seksi)
      .where(eq(pegawai_seksi.id, pegawaiId))
      .limit(1);

    if (!existing || existing.seksi_id !== seksiId) {
      return apiResponse({ message: "Staf pegawai tidak ditemukan di seksi ini." }, 404);
    }

    // Delete pegawai photo from Supabase Storage if applicable
    if (existing.foto && isCmsStoragePublicUrl(existing.foto)) {
      try {
        await removeSupabaseFileByPublicUrl(existing.foto);
      } catch (e) {
        logWarn("pegawai_id_delete_photo_warn", { error: e?.message });
      }
    }

    await db.delete(pegawai_seksi).where(eq(pegawai_seksi.id, pegawaiId));

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.SETTINGS,
      entityId: pegawaiId,
      summary: `Menghapus staf pegawai seksi (${seksiData.judul}): ${existing.nama}`,
      before: existing,
      after: null,
      request,
    });

    // Revalidate public routes
    revalidatePath("/");
    revalidatePath("/informasi/struktur-organisasi");
    revalidatePath(`/layanan/${seksiData.slug}`);

    return apiResponse({
      message: "Data staf pegawai berhasil dihapus secara permanen.",
    });
  } catch (error) {
    logError("pegawai_seksi_id_delete_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Gagal menghapus staf pegawai." },
      500,
    );
  }
}
