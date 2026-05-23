import { apiResponse, getSafeIdFromContext } from "@/lib/prisma-helpers";
import { validateAdmin, ensureUniqueSlug } from "@/lib/cms-utils";
import {
  uploadBase64ImageToSupabase,
  removeSupabaseFileByPublicUrl,
  isCmsStoragePublicUrl,
} from "@/lib/storage-media";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { broadcastRefresh } from "@/lib/realtime-service";

export const dynamic = "force-dynamic";

function toText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

export async function GET(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const id = await getSafeIdFromContext(context);

    const data = await prisma.seksi.findUnique({
      where: { id },
      include: {
        pegawai_seksi: {
          orderBy: {
            sort_order: "asc",
          },
        },
      },
    });

    if (!data) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    return apiResponse(data);
  } catch (error) {
    console.error("GET Admin Seksi Detail Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal memuat detail seksi." },
      500,
    );
  }
}

export async function PUT(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const id = await getSafeIdFromContext(context);
    const body = await request.json().catch(() => ({}));

    const existing = await prisma.seksi.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    const judul = toText(body?.judul, "");
    const deskripsi = toText(body?.deskripsi, "");
    const nama_kepala = toText(body?.nama_kepala, "");
    const nip_kepala = toText(body?.nip_kepala, "");
    const fotoKepalaRaw = toText(body?.foto_kepala, "");
    const fotoKepalaBase64 = toText(body?.foto_kepala_base64, "");
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
          console.warn(
            "Failed to delete old Kepala Seksi photo from Supabase storage:",
            e,
          );
        }
      }
    }

    const updated = await prisma.seksi.update({
      where: { id },
      data: {
        judul,
        slug,
        deskripsi,
        nama_kepala,
        nip_kepala,
        foto_kepala: finalFotoKepala,
        foto_kepala_y: Number.isInteger(foto_kepala_y) ? foto_kepala_y : 50,
        updated_at: new Date(),
      },
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.SETTINGS,
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
    console.error("PUT Admin Seksi Error:", error);
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

    const existing = await prisma.seksi.findUnique({
      where: { id },
      include: {
        pegawai_seksi: true,
      },
    });

    if (!existing) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    // Hapus relasi pegawai (jika tidak cascade di DB)
    if (existing.pegawai_seksi?.length) {
      await prisma.pegawai_seksi.deleteMany({
        where: { seksi_id: id },
      });
    }

    // Hapus file foto kepala (jika tersimpan di storage CMS)
    if (existing.foto_kepala && isCmsStoragePublicUrl(existing.foto_kepala)) {
      try {
        await removeSupabaseFileByPublicUrl(existing.foto_kepala);
      } catch (e) {
        console.warn(
          "Failed to delete Kepala Seksi photo from Supabase storage:",
          e,
        );
      }
    }

    await prisma.seksi.delete({
      where: { id },
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.SETTINGS,
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
    console.error("DELETE Admin Seksi Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal menghapus seksi." },
      500,
    );
  }
}
