import { apiResponse, getSafeIdFromContext } from "@/lib/api-helpers";
import { validateAdmin, ensureUniqueSlug } from "@/lib/cms-utils";
import { cleanString } from "@/lib/validation";
import {
  uploadBase64ImageToSupabase,
  removeSupabaseFileByPublicUrl,
  isCmsStoragePublicUrl,
} from "@/lib/storage-media";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { broadcastRefresh } from "@/lib/realtime-service";
import { db } from "@/lib/drizzle";
import { seksi, pegawai_seksi } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { logWarn, logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

function toText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

export async function GET(request, context) {
  const auth = await validateAdmin({ permission: PERMISSIONS.SEKSI_MANAGE });
  if (!auth.ok) return auth.response;

  try {
    const id = await getSafeIdFromContext(context);

    const data = await db.query.seksi.findFirst({
      where: eq(seksi.id, id),
      with: {
        pegawai_seksis: {
          orderBy: [asc(pegawai_seksi.sort_order)],
        },
      },
    });

    if (!data) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    return apiResponse(data);
  } catch (error) {
    logError("seksi_id_get_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Gagal memuat detail seksi." },
      500,
    );
  }
}

export async function PUT(request, context) {
  const auth = await validateAdmin({ permission: PERMISSIONS.SEKSI_MANAGE });
  if (!auth.ok) return auth.response;

  try {
    const id = await getSafeIdFromContext(context);
    const body = await request.json().catch(() => ({}));

    const [existing] = await db
      .select()
      .from(seksi)
      .where(eq(seksi.id, id))
      .limit(1);

    if (!existing) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    const judul = toText(body?.judul, "");
    const deskripsi = toText(body?.deskripsi, "");
    const nama_kepala = toText(body?.nama_kepala, "");
    const nip_kepala = toText(body?.nip_kepala, "");
    const fotoKepalaRaw = toText(body?.foto_kepala, "");
    const fotoKepalaBase64 = cleanString(body?.foto_kepala_base64, 10_000_000);
    const fotoKepalaName = toText(body?.foto_kepala_name, "kepala-seksi");
    const foto_kepala_y =
      body?.foto_kepala_y !== undefined ? parseInt(body.foto_kepala_y, 10) : 50;

    if (!judul) {
      return apiResponse({ message: "Judul seksi wajib diisi." }, 400);
    }
    if (!nama_kepala) {
      return apiResponse({ message: "Nama Kepala Seksi wajib diisi." }, 400);
    }

    // Generate unique slug if title changed
    let slug = existing.slug;
    if (judul.toLowerCase() !== existing.judul.toLowerCase()) {
      slug = await ensureUniqueSlug("seksi", judul, judul, id);
    }

    let finalFotoKepala = fotoKepalaRaw || existing.foto_kepala;

    // Handle foto kepala upload to Supabase Storage
    if (fotoKepalaBase64) {
      const uploaded = await uploadBase64ImageToSupabase({
        dataUrl: fotoKepalaBase64,
        folder: "seksi",
        fileNameStem: fotoKepalaName || `kasi-${id}`,
      });
      finalFotoKepala = uploaded?.publicUrl || "";

      // Delete old photo if it is hosted in our storage
      if (existing.foto_kepala && isCmsStoragePublicUrl(existing.foto_kepala)) {
        try {
          await removeSupabaseFileByPublicUrl(existing.foto_kepala);
        } catch (e) {
          logWarn("seksi_id_delete_old_photo_warn", { error: e?.message });
        }
      }
    }

    const [updated] = await db
      .update(seksi)
      .set({
        judul,
        slug,
        deskripsi,
        nama_kepala,
        nip_kepala,
        foto_kepala: finalFotoKepala,
        foto_kepala_y: Number.isInteger(foto_kepala_y) ? foto_kepala_y : 50,
        updated_at: new Date(),
      })
      .where(eq(seksi.id, id))
      .returning();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.SEKSI,
      entityId: id,
      summary: `Memperbarui profil seksi kepegawaian: ${judul}`,
      before: existing,
      after: updated,
      request,
    });

    // Revalidate paths to refresh cache on public side
    revalidatePath("/");
    revalidatePath("/informasi/struktur-organisasi");
    revalidatePath(`/layanan/${existing.slug}`);
    if (slug !== existing.slug) {
      revalidatePath(`/layanan/${slug}`);
    }

    broadcastRefresh("seksi");

    return apiResponse({
      message: "Profil seksi berhasil diperbarui.",
      item: updated,
    });
  } catch (error) {
    logError("seksi_id_put_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Gagal memperbarui profil seksi." },
      500,
    );
  }
}

export async function DELETE(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  // Hanya super_admin yang boleh menghapus seksi
  if (auth.session?.role !== "super_admin") {
    return apiResponse(
      {
        message: "Unauthorized. Hanya super_admin yang dapat menghapus seksi.",
      },
      403,
    );
  }

  try {
    const id = await getSafeIdFromContext(context);

    const [existing] = await db
      .select()
      .from(seksi)
      .where(eq(seksi.id, id))
      .limit(1);

    if (!existing) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    // Cek pegawai terkait
    const pegawaiList = await db
      .select()
      .from(pegawai_seksi)
      .where(eq(pegawai_seksi.seksi_id, id));

    // Hapus file foto kepala (jika tersimpan di storage CMS)
    if (existing.foto_kepala && isCmsStoragePublicUrl(existing.foto_kepala)) {
      try {
        await removeSupabaseFileByPublicUrl(existing.foto_kepala);
      } catch (e) {
          logWarn("seksi_id_delete_photo_warn", { error: e?.message });
      }
    }

    await db.delete(seksi).where(eq(seksi.id, id));

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.SEKSI,
      entityId: id,
      summary: `Menghapus profil seksi kepegawaian: ${existing.judul}`,
      before: existing,
      request,
    });

    revalidatePath("/");
    revalidatePath("/informasi/struktur-organisasi");
    revalidatePath(`/layanan/${existing.slug}`);

    broadcastRefresh("seksi");

    return apiResponse({ message: "Seksi berhasil dihapus." });
  } catch (error) {
    logError("seksi_id_delete_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Gagal menghapus seksi." },
      500,
    );
  }
}
