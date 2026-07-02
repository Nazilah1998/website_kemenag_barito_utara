import { revalidatePath, revalidateTag } from "next/cache";
import { ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";
import { cleanString, cleanHtml } from "@/lib/validation";
import {
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { PERMISSIONS } from "@/lib/permissions";
import { apiResponse, getSafeIdFromContext } from "@/lib/api-helpers";
import { broadcastRefresh } from "@/lib/realtime-service";
import { sendNewsPushNotification } from "@/lib/onesignal-service";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logInfo, logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

function createHttpError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const table = "berita";
const MAX_IMAGE_SIZE_KB = 500;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

async function revalidateBeritaPaths(slug) {
  await Promise.all([
    revalidatePath("/"),
    revalidatePath("/beranda"),
    revalidatePath("/berita"),
    revalidatePath("/admin"),
    revalidatePath("/admin/berita"),
    revalidateTag("home-latest-berita"),
    revalidateTag("home-popular-berita"),
    slug ? revalidatePath(`/berita/${slug}`) : Promise.resolve(),
  ]);

  await broadcastRefresh("berita");
}

function stripHtml(html = "") {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildExcerptFromHtml(html = "", maxLength = 180) {
  const plain = stripHtml(html);
  if (!plain) return "";
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 3).trim()}...`;
}

function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(normalized);
  }

  return false;
}

function toSafeSizeNumber(value) {
  const parsed = Number(value || 0);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed);
}

function getBase64PayloadMeta(dataUrl) {
  const input = cleanString(dataUrl, 10_000_000);

  if (!input) return null;

  const match = input.match(/^data:(.+?);base64,(.+)$/);

  if (!match) {
    throw createHttpError("Format file cover tidak valid.", 400);
  }

  const base64Payload = match[2];
  const sizeBytes = Buffer.from(base64Payload, "base64").length;
  const sizeKB = Math.ceil(sizeBytes / 1024);

  if (sizeBytes > MAX_IMAGE_SIZE_BYTES) {
    throw createHttpError(
      `Ukuran cover setelah kompresi masih ${sizeKB} KB. Maksimal ${MAX_IMAGE_SIZE_KB} KB.`,
      400,
    );
  }

  return {
    sizeBytes,
    sizeKB,
    mimeType: match[1],
  };
}

function resolvePublishedAt({
  isPublished,
  publishedAtInput,
  currentPublishedAt = null,
}) {
  if (!isPublished) return currentPublishedAt || null;

  const sourceValue = publishedAtInput || currentPublishedAt || new Date();
  const parsedDate = new Date(sourceValue);

  if (Number.isNaN(parsedDate.getTime())) {
    throw createHttpError("Tanggal publish tidak valid.", 400);
  }

  return parsedDate.toISOString();
}

async function resolveCoverImage({
  body,
  currentUrl = null,
  currentSizeKB = 0,
  currentSizeBytes = 0,
  slugSeed = "",
}) {
  const uploadBase64 = cleanString(body?.cover_upload_base64, 10_000_000);
  const uploadName = cleanString(body?.cover_upload_name) || "cover.webp";
  const currentCover = cleanString(body?.cover_image) || currentUrl || null;

  if (!uploadBase64) {
    return {
      publicUrl: currentCover,
      sizeKB: toSafeSizeNumber(currentSizeKB),
      sizeBytes: toSafeSizeNumber(currentSizeBytes),
    };
  }

  // Pastikan base64 upload valid sebelum lanjut
  const base64Meta = getBase64PayloadMeta(uploadBase64);

  const uploaded = await uploadBase64Image({
    dataUrl: uploadBase64,
    folder: "berita",
    fileNameStem: slugSeed || uploadName,
  });

  // Hapus file lama HANYA jika benar-benar ada URL lama dan berbeda dengan yang baru
  if (currentUrl && currentUrl !== uploaded.publicUrl) {
    try {
      await removeStorageFileByPublicUrl(currentUrl);
      logInfo("berita_id_cover_old_deleted", { currentUrl });
    } catch (error) {
      logError("berita_id_cover_delete_error", { error: error?.message });
    }
  }

  return {
    publicUrl: uploaded.publicUrl,
    sizeKB: base64Meta.sizeKB,
    sizeBytes: base64Meta.sizeBytes,
  };
}

async function buildPayload(
  body,
  {
    currentCoverUrl = null,
    currentSizeKB = 0,
    currentSizeBytes = 0,
    currentPublishedAt = null,
  } = {},
) {
  const title = cleanString(body?.title);
  const content = cleanHtml(body?.content, 60000);
  const excerpt =
    cleanString(body?.excerpt) || buildExcerptFromHtml(content, 180);
  const category = cleanString(body?.category) || "Umum";
  const is_published = toBoolean(body?.is_published);
  const publishedAtInput = cleanString(body?.published_at);

  if (!title) {
    throw createHttpError("Judul berita wajib diisi.", 400);
  }

  if (!content) {
    throw createHttpError("Isi berita wajib diisi.", 400);
  }

  const coverImage = await resolveCoverImage({
    body,
    currentUrl: currentCoverUrl,
    currentSizeKB,
    currentSizeBytes,
    slugSeed: cleanString(body?.slug) || title,
  });

  if (!coverImage.publicUrl) {
    throw createHttpError("Cover berita wajib diupload.", 400);
  }

  return {
    title,
    excerpt,
    category,
    content,
    cover_image: coverImage.publicUrl,
    cover_size_kb: coverImage.sizeKB,
    cover_size_bytes: coverImage.sizeBytes,
    is_published,
    published_at: resolvePublishedAt({
      isPublished: is_published,
      publishedAtInput,
      currentPublishedAt,
    }),
  };
}

export async function GET(request, context) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.BERITA_UPDATE,
  });
  if (!auth.ok) return auth.response;

  try {
    const safeId = await getSafeIdFromContext(context);

    const [data] = await db
      .select()
      .from(berita)
      .where(eq(berita.id, safeId))
      .limit(1);

    if (!data) {
      return apiResponse({ message: "Berita tidak ditemukan." }, 404);
    }

    return apiResponse(data);
  } catch (error) {
    logError("berita_id_get_error", { error: error?.message });
    return apiResponse(
      { message: error.message || "Gagal memuat berita." },
      error.status || 500,
    );
  }
}

export async function PUT(request, context) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.BERITA_UPDATE,
  });
  if (!auth.ok) return auth.response;

  try {
    const safeId = await getSafeIdFromContext(context);
    const body = await request.json();

    const [existingItem] = await db
      .select()
      .from(berita)
      .where(eq(berita.id, safeId))
      .limit(1);

    if (!existingItem) throw createHttpError("Berita tidak ditemukan.", 404);

    const payload = await buildPayload(body, {
      currentCoverUrl: existingItem.cover_image || null,
      currentSizeKB: existingItem.cover_size_kb || 0,
      currentSizeBytes: Number(existingItem.cover_size_bytes || 0),
      currentPublishedAt: existingItem.published_at || null,
    });

    const slug = await ensureUniqueSlug(
      table,
      cleanString(body?.slug) || payload.title,
      payload.title,
      safeId,
    );

    const [data] = await db
      .update(berita)
      .set({
        ...payload,
        slug
      })
      .where(eq(berita.id, safeId))
      .returning();

    await revalidateBeritaPaths(data?.slug);

    if (existingItem.slug && existingItem.slug !== data.slug) {
      await revalidatePath(`/berita/${existingItem.slug}`);
    }

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.BERITA,
      entityId: data?.id || safeId,
      summary: `Memperbarui berita "${data?.title || existingItem?.title || safeId}"`,
      before: {
        slug: existingItem?.slug,
        title: existingItem?.title,
        excerpt: existingItem?.excerpt,
        category: existingItem?.category,
        content: existingItem?.content,
        is_published: existingItem?.is_published,
        published_at: existingItem?.published_at,
        cover_image: existingItem?.cover_image,
      },
      after: {
        slug: data?.slug,
        title: data?.title,
        excerpt: data?.excerpt,
        category: data?.category,
        content: data?.content,
        is_published: data?.is_published,
        published_at: data?.published_at,
        cover_image: data?.cover_image,
      },
      request,
    });

    // Kirim Push Notification JIKA statusnya berubah dari DRAFT menjadi PUBLISH
    if (!existingItem.is_published && data?.is_published) {
      // Background task, jangan di-await agar response API tidak delay
      sendNewsPushNotification(
        data.title,
        data.slug,
        data.excerpt,
        data.cover_image
      );
    }

    return apiResponse({
      message: `Berita berhasil diperbarui. Ukuran cover aktif ${data?.cover_size_kb || payload.cover_size_kb} KB.`,
      item: data,
    });
  } catch (error) {
    logError("berita_id_put_error", { error: error?.message });
    return apiResponse(
      {
        message: error.message || "Gagal memperbarui berita.",
      },
      error.status || 500,
    );
  }
}

export async function DELETE(request, context) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.BERITA_DELETE,
  });
  if (!auth.ok) return auth.response;

  try {
    const safeId = await getSafeIdFromContext(context);

    const [existingItem] = await db
      .select({ id: berita.id, slug: berita.slug, cover_image: berita.cover_image })
      .from(berita)
      .where(eq(berita.id, safeId))
      .limit(1);

    if (!existingItem) throw createHttpError("Berita tidak ditemukan.", 404);

    await db.delete(berita).where(eq(berita.id, safeId));

    try {
      if (existingItem.cover_image) {
        await removeStorageFileByPublicUrl(existingItem.cover_image);
      }
    } catch (cleanupError) {
      logError("berita_id_storage_cleanup_warning", { error: cleanupError?.message });
    }

    await revalidateBeritaPaths(existingItem?.slug);

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.BERITA,
      entityId: existingItem?.id || safeId,
      summary: `Menghapus berita "${existingItem?.slug || safeId}"`,
      before: {
        slug: existingItem?.slug,
        cover_image: existingItem?.cover_image,
      },
      after: null,
      request,
    });

    return apiResponse({
      message: "Berita berhasil dihapus.",
    });
  } catch (error) {
    logError("berita_id_delete_error", { error: error?.message });
    return apiResponse(
      {
        message: error.message || "Gagal menghapus berita.",
      },
      error.status || 500,
    );
  }
}
