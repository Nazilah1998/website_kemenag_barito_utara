import { apiResponse, getSafeIdFromContext } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { uploadBase64ImageToSupabase } from "@/lib/storage-media";
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

export async function POST(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const seksiId = await getSafeIdFromContext(context);
    const body = await request.json().catch(() => ({}));

    const seksi = await prisma.seksi.findUnique({
      where: { id: seksiId }
    });

    if (!seksi) {
      return apiResponse({ message: "Seksi tidak ditemukan." }, 404);
    }

    const nama = toText(body?.nama, "");
    const nip = toText(body?.nip, "");
    const jabatan = toText(body?.jabatan, "");
    const sort_order = toNumber(body?.sort_order, 0);
    const fotoBase64 = toText(body?.foto_base64, "");
    const fotoName = toText(body?.foto_name, "pegawai");
    const foto_y = body?.foto_y !== undefined ? parseInt(body.foto_y, 10) : 50;

    if (!nama) {
      return apiResponse({ message: "Nama pegawai wajib diisi." }, 400);
    }
    if (!jabatan) {
      return apiResponse({ message: "Jabatan pegawai wajib diisi." }, 400);
    }

    let finalFoto = "";

    // Handle foto pegawai upload to Supabase Storage
    if (fotoBase64) {
      const uploaded = await uploadBase64ImageToSupabase({
        dataUrl: fotoBase64,
        folder: "pegawai",
        fileNameStem: fotoName || `pegawai-${Date.now()}`,
      });
      finalFoto = uploaded?.publicUrl || "";
    }

    const data = await prisma.pegawai_seksi.create({
      data: {
        seksi_id: seksiId,
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
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.SETTINGS,
      entityId: data.id,
      summary: `Menambahkan staf pegawai seksi (${seksi.judul}): ${nama}`,
      after: data,
      request,
    });

    // Revalidate public routes
    revalidatePath("/");
    revalidatePath("/informasi/struktur-organisasi");
    revalidatePath(`/layanan/${seksi.slug}`);

    return apiResponse({
      message: "Staf pegawai berhasil ditambahkan.",
      item: data
    });
  } catch (error) {
    console.error("POST Admin Pegawai Seksi Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal menambahkan staf pegawai." },
      500,
    );
  }
}
