import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";
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

const LIMITS = {
  title: { min: 3, max: 200 },
  slug: { max: 220 },
  excerpt: { max: 500 },
  category: { max: 60 },
  content: { min: 20, max: 60_000 },
};

export const dynamic = "force-dynamic";

const table = "berita";
const MAX_IMAGE_SIZE_KB = 100;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

const selectFields = `
  id,
  slug,
  title,
  excerpt,
  category,
  content,
  cover_image,
  cover_size_kb,
  cover_size_bytes,
  is_published,
  published_at,
  views,
  author_id,
  created_at,
  updated_at
`;

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function createNoStoreResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
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
  supabase,
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
    supabase,
    dataUrl: uploadBase64,
    folder: "berita",
    fileNameStem: slugSeed || uploadName,
  });

  if (currentUrl && currentUrl !== uploaded.publicUrl) {
    try {
      await removeStorageFileByPublicUrl(supabase, currentUrl);
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
  supabase,
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
    supabase,
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

function revalidateBeritaPaths(slug) {
  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath("/admin");
  revalidatePath("/admin/berita");

  if (slug) {
    revalidatePath(`/berita/${slug}`);
  }
}

export async function GET() {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.BERITA_VIEW,
  });
  if (!auth.ok) return auth.response;

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(table)
      .select(selectFields)
      .order("is_published", { ascending: false })
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return createNoStoreResponse({
      items: data ?? [],
    });
  } catch (error) {
    return createNoStoreResponse(
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
    const supabase = createAdminClient();

    const payload = await buildPayload(supabase, body);

    // Editor tidak boleh langsung publish tanpa izin.
    if (
      payload.is_published &&
      !hasPermission(auth.session?.role, PERMISSIONS.BERITA_PUBLISH)
    ) {
      payload.is_published = false;
      payload.published_at = null;
    }

    const slug = await ensureUniqueSlug(
      supabase,
      table,
      cleanString(body?.slug) || payload.title,
      payload.title,
    );

    const { data, error } = await supabase
      .from(table)
      .insert({
        ...payload,
        slug,
        author_id: auth.session?.profile?.id ?? null,
      })
      .select(selectFields)
      .single();

    if (error) throw error;

    revalidateBeritaPaths(data?.slug);

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.BERITA,
      entityId: data?.id,
      summary: `Menambah berita \"${data?.title || payload.title}\"`,
      after: { slug: data?.slug, is_published: data?.is_published },
      request,
    });

    return createNoStoreResponse(
      {
        message: `Berita berhasil ditambahkan. Ukuran cover tersimpan ${data?.cover_size_kb || payload.cover_size_kb} KB.`,
        item: data,
      },
      201,
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      const resp = validationErrorResponse(error);
      return createNoStoreResponse(resp.body, resp.status);
    }
    return createNoStoreResponse(
      {
        message: error.message || "Gagal menambahkan berita.",
      },
      error.status || 500,
    );
  }
}
