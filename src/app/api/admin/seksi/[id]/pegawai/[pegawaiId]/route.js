import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { uploadBase64ImageToSupabase, removeSupabaseFileByPublicUrl, isCmsStoragePublicUrl } from "@/lib/storage-media";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const params = await context.params;
    const seksiId = params?.id;
    const pegawaiId = params?.pegawaiId;

    if (!seksiId || !pegawaiId) {
      return apiResponse({ message: "Parameter tidak lengkap." }, 400);
    }

    const seksi = await prisma.seksi.findUnique({
      where: { id: seksiId }
    });

    if (!seksi) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    const existing = await prisma.pegawai_seksi.findUnique({
      where: { id: pegawaiId }
    });

    if (!existing || existing.seksi_id !== seksiId) {
      return apiResponse({ message: "Staf pegawai tidak ditemukan di seksi ini." }, 404);
    }

    const body = await request.json().catch(() => ({}));
    const nama = toText(body?.nama, "");
    const nip = toText(body?.nip, "");
    const jabatan = toText(body?.jabatan, "");
    const sort_order = toNumber(body?.sort_order, existing.sort_order);
    const fotoRaw = toText(body?.foto, "");
    const fotoBase64 = toText(body?.foto_base64, "");
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
          console.warn("Failed to delete old Pegawai photo from Supabase storage:", e);
        }
      }
    }

    const updated = await prisma.pegawai_seksi.update({
      where: { id: pegawaiId },
      data: {
        nama,
        nip: nip || null,
        jabatan,
        foto: finalFoto || null,
        foto_y: Number.isInteger(foto_y) ? foto_y : 50,
        sort_order,
      }
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.SETTINGS,
      entityId: pegawaiId,
      summary: `Memperbarui staf pegawai seksi (${seksi.judul}): ${nama}`,
      before: existing,
      after: updated,
      request,
    });

    // Revalidate public routes
    revalidatePath("/");
    revalidatePath("/informasi/struktur-organisasi");
    revalidatePath(`/layanan/${seksi.slug}`);

    return apiResponse({
      message: "Data staf pegawai berhasil diperbarui.",
      item: updated
    });
  } catch (error) {
    console.error("PUT Admin Pegawai Seksi Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal memperbarui staf pegawai." },
      500,
    );
  }
}

export async function DELETE(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const params = await context.params;
    const seksiId = params?.id;
    const pegawaiId = params?.pegawaiId;

    if (!seksiId || !pegawaiId) {
      return apiResponse({ message: "Parameter tidak lengkap." }, 400);
    }

    const seksi = await prisma.seksi.findUnique({
      where: { id: seksiId }
    });

    if (!seksi) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    const existing = await prisma.pegawai_seksi.findUnique({
      where: { id: pegawaiId }
    });

    if (!existing || existing.seksi_id !== seksiId) {
      return apiResponse({ message: "Staf pegawai tidak ditemukan di seksi ini." }, 404);
    }

    // Delete pegawai photo from Supabase Storage if applicable
    if (existing.foto && isCmsStoragePublicUrl(existing.foto)) {
      try {
        await removeSupabaseFileByPublicUrl(existing.foto);
      } catch (e) {
        console.warn("Failed to delete Pegawai photo from Supabase storage upon deletion:", e);
      }
    }

    await prisma.pegawai_seksi.delete({
      where: { id: pegawaiId }
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.SETTINGS,
      entityId: pegawaiId,
      summary: `Menghapus staf pegawai seksi (${seksi.judul}): ${existing.nama}`,
      before: existing,
      after: null,
      request,
    });

    // Revalidate public routes
    revalidatePath("/");
    revalidatePath("/informasi/struktur-organisasi");
    revalidatePath(`/layanan/${seksi.slug}`);

    return apiResponse({
      message: "Data staf pegawai berhasil dihapus secara permanen.",
    });
  } catch (error) {
    console.error("DELETE Admin Pegawai Seksi Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal menghapus staf pegawai." },
      500,
    );
  }
}
