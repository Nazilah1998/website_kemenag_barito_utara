import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { broadcastRefresh } from "@/lib/realtime-service";
import {
  isCmsStoragePublicUrl,
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";
import { normalizeHomepageSlide } from "@/lib/homepage-slides";
import { apiResponse, getSafeIdFromContext } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";

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

export async function PATCH(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const id = await getSafeIdFromContext(context);
    if (!id) {
      return apiResponse({ message: "ID slide tidak valid." }, 400);
    }

    const body = await request.json().catch(() => ({}));
    const supabase = createAdminClient();

    const existing = await prisma.homepage_slides.findUnique({
      where: { id: id }
    });

    if (!existing) {
      return apiResponse({ message: "Slide tidak ditemukan." }, 404);
    }

    const title = toText(body?.title, existing.title || "");
    const caption = toText(body?.caption, existing.caption || "");
    const imageUrlRaw = toText(body?.image_url, existing.image_url || "");
    const imageUploadBase64 = toText(body?.image_upload_base64, "");
    const imageUploadName = toText(body?.image_upload_name, title || "slide");
    const isPublished = toBool(body?.is_published, existing.is_published);
    const sortOrder = toNumber(body?.sort_order, existing.sort_order);
    const category = toText(body?.category, existing.category || "utama");

    if (!title) {
      return apiResponse({ message: "Judul slide wajib diisi." }, 400);
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

      if (
        existing.image_url &&
        existing.image_url !== finalImageUrl &&
        isCmsStoragePublicUrl(existing.image_url)
      ) {
        await removeStorageFileByPublicUrl(supabase, existing.image_url).catch(
          () => null,
        );
      }
    }

    if (!finalImageUrl) {
      return apiResponse({ message: "Gambar slide wajib diupload." }, 400);
    }

    const data = await prisma.homepage_slides.update({
      where: { id: id },
      data: {
        title,
        caption,
        image_url: finalImageUrl,
        category,
        is_published: isPublished,
        sort_order: sortOrder,
        updated_at: new Date(),
      }
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.SETTINGS,
      entityId: id,
      summary: `Memperbarui slide beranda: ${title}`,
      before: existing,
      after: data,
      request,
    });

    revalidatePath("/");
    revalidatePath("/beranda");
    broadcastRefresh("slider");

    return apiResponse({
      message: "Slide beranda berhasil diperbarui.",
      item: normalizeHomepageSlide(data || {}),
    });
  } catch (error) {
    console.error("PATCH Homepage Slides Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal memperbarui slide beranda." },
      500,
    );
  }
}

export async function DELETE(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const id = await getSafeIdFromContext(context);
    const supabase = createAdminClient();

    const existing = await prisma.homepage_slides.findUnique({
      where: { id: id }
    });

    if (!existing) {
      return apiResponse(
        { message: "Slide tidak ditemukan." },
        404,
      );
    }

    await prisma.homepage_slides.delete({
      where: { id: id }
    });

    if (existing.image_url && isCmsStoragePublicUrl(existing.image_url)) {
      await removeStorageFileByPublicUrl(supabase, existing.image_url).catch(
        () => null,
      );
    }

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.SETTINGS,
      entityId: id,
      summary: `Menghapus slide beranda: ${existing.title}`,
      before: existing,
      request,
    });

    revalidatePath("/");
    revalidatePath("/beranda");
    broadcastRefresh("slider");

    return apiResponse({
      message: "Slide beranda berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE Homepage Slides Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal menghapus slide beranda." },
      500,
    );
  }
}
