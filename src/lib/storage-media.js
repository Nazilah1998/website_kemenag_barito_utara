import { createAdminClient } from "@/lib/supabase/admin";

export const CMS_MEDIA_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_CMS_BUCKET || "cms-media";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DEFAULT_FILE_SIZE_LIMIT = 2 * 1024 * 1024;

export async function ensureCmsBucket(supabase = createAdminClient()) {
  const { data, error } = await supabase.storage.getBucket(CMS_MEDIA_BUCKET);

  if (!error && data) {
    return data;
  }

  const { data: created, error: createError } =
    await supabase.storage.createBucket(CMS_MEDIA_BUCKET, {
      public: true,
      fileSizeLimit: DEFAULT_FILE_SIZE_LIMIT,
      allowedMimeTypes: ALLOWED_MIME_TYPES,
    });

  if (
    createError &&
    !String(createError?.message || "")
      .toLowerCase()
      .includes("already")
  ) {
    throw createError;
  }

  return created ?? { name: CMS_MEDIA_BUCKET };
}

export async function uploadBase64Image({
  supabase = createAdminClient(),
  dataUrl,
  folder = "berita",
  fileNameStem = "image",
}) {
  await ensureCmsBucket(supabase);

  const parsed = parseDataUrl(dataUrl);

  if (!ALLOWED_MIME_TYPES.includes(parsed.mimeType)) {
    throw new Error("Tipe file gambar tidak didukung.");
  }

  const ext = mimeTypeToExt(parsed.mimeType);
  const path = buildStoragePath(folder, fileNameStem, ext);

  const { error: uploadError } = await supabase.storage
    .from(CMS_MEDIA_BUCKET)
    .upload(path, parsed.buffer, {
      contentType: parsed.mimeType,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from(CMS_MEDIA_BUCKET)
    .getPublicUrl(path);

  return {
    path,
    publicUrl: publicUrlData?.publicUrl || null,
    mimeType: parsed.mimeType,
    sizeBytes: parsed.buffer.length,
  };
}

export async function removeStorageFileByPublicUrl(
  supabase = createAdminClient(),
  publicUrl,
) {
  const path = extractStoragePathFromPublicUrl(publicUrl);

  if (!path) {
    return false;
  }

  const { error } = await supabase.storage
    .from(CMS_MEDIA_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }

  return true;
}

export function isCmsStoragePublicUrl(value = "") {
  return extractStoragePathFromPublicUrl(value) !== null;
}

function parseDataUrl(dataUrl = "") {
  const match = String(dataUrl || "").match(/^data:(.+?);base64,(.+)$/);

  if (!match) {
    throw new Error("Format base64 gambar tidak valid.");
  }

  const mimeType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");

  return { mimeType, buffer };
}

function mimeTypeToExt(mimeType = "") {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  throw new Error("Mime type gambar tidak didukung.");
}

function sanitizeSegment(value = "") {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildStoragePath(folder, fileNameStem, ext) {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const safeFolder = sanitizeSegment(folder) || "media";
  const safeStem = sanitizeSegment(fileNameStem) || "image";
  const unique = `${Date.now()}-${crypto.randomUUID()}`;

  return `${safeFolder}/${year}/${month}/${safeStem}-${unique}.${ext}`;
}

function extractStoragePathFromPublicUrl(publicUrl = "") {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${CMS_MEDIA_BUCKET}/`;
    const index = url.pathname.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}
