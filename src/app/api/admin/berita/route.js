import { revalidatePath, revalidateTag } from "next/cache";
import { cleanString } from "@/lib/validation";
import { ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";
import {
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";
import {
  ValidationError,
  cleanHtml,
  requireFields,
  validationErrorResponse,
} from "@/lib/validation";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { hasUserPermission } from "@/lib/user-permissions";
import { apiResponse } from "@/lib/api-helpers";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { broadcastRefresh } from "@/lib/realtime-service";
import { logInfo, logError } from "@/lib/logger";

const LIMITS = {
  title: { min: 3, max: 200 },
  slug: { max: 220 },
  excerpt: { max: 500 },
  category: { max: 60 },
  content: { min: 20, max: 60_000 },
};

export const dynamic = "force-dynamic";

function createHttpError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const table = "berita";
const MAX_IMAGE_SIZE_KB = 500;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

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
  // Jika user memberikan tanggal publish, hormati itu (mendukung scheduled publish).
  if (publishedAtInput) {
    const parsedDate = new Date(publishedAtInput);
    if (Number.isNaN(parsedDate.getTime())) {
      throw createHttpError("Tanggal publish tidak valid.", 400);
    }
    return parsedDate.toISOString();
  }

  if (!isPublished) {
    // Draft tanpa jadwal -> kosongkan.
    return currentPublishedAt || null;
  }

  const sourceValue = currentPublishedAt || new Date();
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
  // Untuk berita baru (currentUrl = null), skip penghapusan
  if (currentUrl && currentUrl !== uploaded.publicUrl) {
    try {
      await removeStorageFileByPublicUrl(currentUrl);
      logInfo("berita_cover_old_deleted", { currentUrl });
    } catch (error) {
      logError("berita_cover_delete_error", { error: error?.message });
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
  const title = cleanString(body?.title).slice(0, LIMITS.title.max);
  const rawContent = typeof body?.content === "string" ? body.content : "";
  const content = cleanHtml(rawContent, LIMITS.content.max);
  const excerpt = (
    cleanString(body?.excerpt) || buildExcerptFromHtml(content, 180)
  ).slice(0, LIMITS.excerpt.max);
  const category =
    cleanString(body?.category).slice(0, LIMITS.category.max) || "Umum";
  const is_published = toBoolean(body?.is_published);
  const publishedAtInput = cleanString(body?.published_at);

  requireFields({}, [
    {
      field: "title",
      label: "Judul berita",
      value: title,
      min: LIMITS.title.min,
      max: LIMITS.title.max,
    },
    {
      field: "content",
      label: "Isi berita",
      value: stripHtml(content),
      min: LIMITS.content.min,
    },
  ]);

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

async function revalidateBeritaPaths(slug) {
  await Promise.all([
    revalidatePath("/"),
    revalidatePath("/beranda"),
    revalidatePath("/berita"),
    revalidatePath("/admin"),
    revalidatePath("/admin/berita"),
    revalidateTag("home-latest-berita", "max"),
    revalidateTag("home-popular-berita", "max"),
    slug ? revalidatePath(`/berita/${slug}`) : Promise.resolve(),
  ]);

  await broadcastRefresh("berita");
}


export async function GET(request) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.BERITA_VIEW,
  });
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(10000, Math.max(1, parseInt(searchParams.get("limit") || "10000")));
    const skip = (page - 1) * limit;

    const [data, [{ count: total }]] = await Promise.all([
      db
        .select({
          id: berita.id,
          slug: berita.slug,
          title: berita.title,
          excerpt: berita.excerpt,
          category: berita.category,
          content: berita.content,
          cover_image: berita.cover_image,
          cover_size_kb: berita.cover_size_kb,
          cover_size_bytes: berita.cover_size_bytes,
          is_published: berita.is_published,
          published_at: berita.published_at,
          views: berita.views,
          author_id: berita.author_id,
          created_at: berita.created_at,
          updated_at: berita.updated_at,
        })
        .from(berita)
        .orderBy(desc(berita.is_published), desc(berita.published_at), desc(berita.created_at))
        .offset(skip)
        .limit(limit),
      db.select({ count: sql`count(*)` }).from(berita)
    ]);

    return apiResponse({
      items: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logError("berita_get_error", { error: error?.message });
    return apiResponse(
      {
        message: error.message || "Gagal mengambil daftar berita.",
      },
      error.status || 500,
    );
  }
}

export async function POST(request) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.BERITA_CREATE,
  });
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    const payload = await buildPayload(body);

    // Editor tidak boleh langsung publish tanpa izin.
    if (
      payload.is_published &&
      !hasUserPermission(auth.permissionContext, PERMISSIONS.BERITA_PUBLISH)
    ) {
      payload.is_published = false;
      payload.published_at = undefined;
    }

    const slug = await ensureUniqueSlug(
      table,
      cleanString(body?.slug) || payload.title,
      payload.title,
    );

    const [data] = await db
      .insert(berita)
      .values({
        ...payload,
        slug,
        author_id: auth.session?.profile?.id ?? null,
      })
      .returning();

    await revalidateBeritaPaths(data?.slug);

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.BERITA,
      entityId: data?.id,
      summary: `Menambah berita "${data?.title || payload.title}"`,
      after: { slug: data?.slug, is_published: data?.is_published },
      request,
    });

    return apiResponse(
      {
        message: `Berita berhasil ditambahkan. Ukuran cover tersimpan ${data?.cover_size_kb || payload.cover_size_kb} KB.`,
        item: data,
      },
      201,
    );
  } catch (error) {
    logError("berita_post_error", { error: error?.message });
    if (error instanceof ValidationError) {
      const resp = validationErrorResponse(error);
      return apiResponse(resp.body, resp.status);
    }
    return apiResponse(
      {
        message: error.message || "Gagal menambahkan berita.",
      },
      error.status || 500,
    );
  }
}
