import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";
import {
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";

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
  if (!isPublished) return null;

  const sourceValue = publishedAtInput || currentPublishedAt || new Date();
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
  const title = cleanString(body?.title);
  const content = cleanString(body?.content);
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
  const auth = await validateAdmin();
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
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const payload = await buildPayload(supabase, body);

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

    return createNoStoreResponse(
      {
        message: `Berita berhasil ditambahkan. Ukuran cover tersimpan ${data?.cover_size_kb || payload.cover_size_kb} KB.`,
        item: data,
      },
      201,
    );
  } catch (error) {
    return createNoStoreResponse(
      {
        message: error.message || "Gagal menambahkan berita.",
      },
      error.status || 500,
    );
  }
}
