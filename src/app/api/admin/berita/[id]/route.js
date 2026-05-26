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
import { db } from "@/lib/drizzle";
import { berita, galeri } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

function createHttpError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const table = "berita";
const MAX_IMAGE_SIZE_KB = 500;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

function revalidateBeritaPaths(slug) {
  revalidatePath("/");
  revalidatePath("/beranda");
  revalidatePath("/berita");
  revalidatePath("/admin");
  revalidatePath("/admin/berita");
  revalidateTag("home-latest-berita");
  revalidateTag("home-popular-berita");

  if (slug) {
    revalidatePath(`/berita/${slug}`);
  }
  
  broadcastRefresh("berita");
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
  const input = cleanString(dataUrl);

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
  const uploadBase64 = cleanString(body?.cover_upload_base64);
  const uploadName = cleanString(body?.cover_upload_name) || "cover.webp";
  const currentCover = cleanString(body?.cover_image) || currentUrl || null;

  if (!uploadBase64) {
    return {
      publicUrl: currentCover,
      sizeKB: toSafeSizeNumber(currentSizeKB),
      sizeBytes: toSafeSizeNumber(currentSizeBytes),
    };
  }

  const base64Meta = getBase64PayloadMeta(uploadBase64);

  const uploaded = await uploadBase64Image({
    dataUrl: uploadBase64,
    folder: "berita",
    fileNameStem: slugSeed || uploadName,
  });

  if (currentUrl && currentUrl !== uploaded.publicUrl) {
    try {
      await removeStorageFileByPublicUrl(currentUrl);
    } catch (error) {
      console.error("Gagal menghapus cover lama berita:", error);
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

async function syncRelatedGaleriMetadata(beritaItem) {
  const [galeriItem] = await db
    .select()
    .from(galeri)
    .where(
      and(
        eq(galeri.source_type, "berita"),
        eq(galeri.source_id, beritaItem.id)
      )
    )
    .limit(1);

  if (!galeriItem) {
    return;
  }

  const patch = {
    title: beritaItem.title,
    link_url: `/berita/${beritaItem.slug}`,
    is_published: Boolean(beritaItem.is_published),
    published_at: beritaItem.published_at,
    updated_at: new Date()
  };

  if (!galeriItem.image_url) {
    patch.image_url = beritaItem.cover_image;
    patch.image_size_kb = beritaItem.cover_size_kb || 0;
    patch.image_size_bytes = beritaItem.cover_size_bytes || 0;
  }

  await db
    .update(galeri)
    .set(patch)
    .where(eq(galeri.id, galeriItem.id));
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
    console.error("GET Berita Error:", error);
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

    await syncRelatedGaleriMetadata(data);

    revalidateBeritaPaths(data?.slug);

    if (existingItem.slug && existingItem.slug !== data.slug) {
      revalidatePath(`/berita/${existingItem.slug}`);
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

    return apiResponse({
      message: `Berita berhasil diperbarui. Ukuran cover aktif ${data?.cover_size_kb || payload.cover_size_kb} KB.`,
      item: data,
    });
  } catch (error) {
    console.error("PUT Berita Error:", error);
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

    const relatedGalleryRows = await db
      .select({ id: galeri.id, image_url: galeri.image_url })
      .from(galeri)
      .where(
        and(
          eq(galeri.source_type, "berita"),
          eq(galeri.source_id, safeId)
        )
      );

    // Hapus berita dan galeri terkait dalam 1 transaksi
    await db.transaction(async (tx) => {
      await tx.delete(galeri).where(
        and(
          eq(galeri.source_type, "berita"),
          eq(galeri.source_id, safeId)
        )
      );
      await tx.delete(berita).where(eq(berita.id, safeId));
    });

    try {
      const filesToDelete = new Set();

      if (existingItem.cover_image) {
        filesToDelete.add(existingItem.cover_image);
      }

      for (const row of relatedGalleryRows || []) {
        if (row?.image_url) {
          filesToDelete.add(row.image_url);
        }
      }

      for (const fileUrl of filesToDelete) {
        await removeStorageFileByPublicUrl(fileUrl);
      }
    } catch (cleanupError) {
      console.error("Storage cleanup warning:", cleanupError);
    }

    revalidateBeritaPaths(existingItem?.slug);

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.BERITA,
      entityId: existingItem?.id || safeId,
      summary: `Menghapus berita "${existingItem?.slug || safeId}"`,
      before: {
        slug: existingItem?.slug,
        cover_image: existingItem?.cover_image,
        related_gallery_count: (relatedGalleryRows || []).length,
      },
      after: null,
      request,
      metadata: {
        deleted_gallery_ids: (relatedGalleryRows || [])
          .map((row) => row?.id)
          .filter(Boolean),
      },
    });

    return apiResponse({
      message: "Berita berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE Berita Error:", error);
    return apiResponse(
      {
        message: error.message || "Gagal menghapus berita.",
      },
      error.status || 500,
    );
  }
}
