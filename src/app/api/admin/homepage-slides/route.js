import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { uploadBase64Image } from "@/lib/storage-media";
import { normalizeHomepageSlide } from "@/lib/homepage-slides";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { db } from "@/lib/drizzle";
import { homepage_slides } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
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
    const data = await db
      .select()
      .from(homepage_slides)
      .orderBy(asc(homepage_slides.sort_order), desc(homepage_slides.updated_at));

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

    const [data] = await db
      .insert(homepage_slides)
      .values({
        title,
        caption,
        image_url: finalImageUrl,
        category,
        is_published: isPublished,
        sort_order: sortOrder,
      })
      .returning();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.HOMEPAGE_SLIDES,
      entityId: data?.id,
      summary: `Menambah slide beranda: ${title}`,
      after: data,
      request,
    });

    revalidatePath("/");
    revalidatePath("/beranda");
    revalidateTag("home-public-slides");
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
