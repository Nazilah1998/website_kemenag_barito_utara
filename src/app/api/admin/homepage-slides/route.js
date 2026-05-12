import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadBase64Image } from "@/lib/storage-media";
import { normalizeHomepageSlide } from "@/lib/homepage-slides";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { broadcastRefresh } from "@/lib/realtime-service";

export const dynamic = "force-dynamic";

function toText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return fallback;
}



export async function GET() {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const data = await prisma.homepage_slides.findMany({
      orderBy: [
        { sort_order: 'asc' },
        { updated_at: 'desc' }
      ]
    });

    return apiResponse({
      items: (data || []).map(normalizeHomepageSlide),
    });
  } catch (error) {
    console.error("GET Homepage Slides Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal memuat data slider beranda." },
      500,
    );
  }
}

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const supabase = createAdminClient();

    const title = toText(body?.title, "");
    const caption = toText(body?.caption, "");
    const imageUrlRaw = toText(body?.image_url, "");
    const imageUploadBase64 = toText(body?.image_upload_base64, "");
    const imageUploadName = toText(body?.image_upload_name, "homepage-slide");
    const isPublished = toBool(body?.is_published, true);
    const sortOrder = toNumber(body?.sort_order, 0);
    const category = toText(body?.category, "utama");

    if (!title) {
      return apiResponse(
        { message: "Judul slide wajib diisi." },
        400,
      );
    }

    let finalImageUrl = imageUrlRaw;

    if (imageUploadBase64) {
      const uploaded = await uploadBase64Image({
        supabase,
        dataUrl: imageUploadBase64,
        folder: "homepage-slides",
        fileNameStem: imageUploadName || title,
      });
      finalImageUrl = uploaded?.publicUrl || "";
    }

    if (!finalImageUrl) {
      return apiResponse(
        { message: "Gambar slide wajib diupload." },
        400,
      );
    }

    const data = await prisma.homepage_slides.create({
      data: {
        title,
        caption,
        image_url: finalImageUrl,
        category,
        is_published: isPublished,
        sort_order: sortOrder,
      }
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.SETTINGS, // Ganti ke entity yang sesuai jika ada
      entityId: data?.id,
      summary: `Menambah slide beranda: ${title}`,
      after: data,
      request,
    });

    revalidatePath("/");
    revalidatePath("/beranda");
    broadcastRefresh("slider");

    return apiResponse({
      message: "Slide beranda berhasil ditambahkan.",
      item: normalizeHomepageSlide(data || {}),
    });
  } catch (error) {
    console.error("POST Homepage Slides Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal menambahkan slide beranda." },
      500,
    );
  }
}
