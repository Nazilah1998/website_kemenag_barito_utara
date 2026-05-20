import { uploadToR2, deleteFromR2, getR2PublicUrl } from "./r2";
import { createAdminClient } from "./supabase/admin";

export const CMS_MEDIA_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_CMS_BUCKET || "cms-media";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadBase64Image({
  dataUrl,
  folder = "berita",
  fileNameStem = "image",
}) {

  const parsed = parseDataUrl(dataUrl);

  if (!ALLOWED_MIME_TYPES.includes(parsed.mimeType)) {
    throw new Error("Tipe file gambar tidak didukung.");
  }

  const ext = mimeTypeToExt(parsed.mimeType);
  const path = buildStoragePath(folder, fileNameStem, ext);

  const publicUrl = await uploadToR2(parsed.buffer, path, parsed.mimeType);

  return {
    path,
    publicUrl,
    mimeType: parsed.mimeType,
    sizeBytes: parsed.buffer.length,
  };
}

export async function uploadBase64ImageToSupabase({
  dataUrl,
  folder = "seksi",
  fileNameStem = "image",
}) {
  const parsed = parseDataUrl(dataUrl);

  if (!ALLOWED_MIME_TYPES.includes(parsed.mimeType)) {
    throw new Error("Tipe file gambar tidak didukung.");
  }

  const ext = mimeTypeToExt(parsed.mimeType);
  const path = buildStoragePath(folder, fileNameStem, ext);

  const supabase = createAdminClient();
  const bucketName = CMS_MEDIA_BUCKET;

  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(path, parsed.buffer, {
      contentType: parsed.mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Gagal mengupload ke Supabase Storage: ${error.message}`);
  }

  const { data: publicUrlData } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(path);

  return {
    path,
    publicUrl: publicUrlData?.publicUrl || "",
    mimeType: parsed.mimeType,
    sizeBytes: parsed.buffer.length,
  };
}

export async function removeSupabaseFileByPublicUrl(publicUrl = "") {
  const path = extractStoragePathFromPublicUrl(publicUrl);

  if (!path) {
    return false;
  }

  const supabase = createAdminClient();
  const bucketName = CMS_MEDIA_BUCKET;

  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .remove([path]);

  if (error) {
    console.error("Gagal menghapus file dari Supabase Storage:", error.message);
    return false;
  }

  return true;
}

export async function removeStorageFileByPublicUrl(arg1, arg2) {
  const publicUrl = arg2 !== undefined ? arg2 : arg1;
  const path = extractStoragePathFromPublicUrl(publicUrl);

  if (!path) {
    return false;
  }

  await deleteFromR2(path);

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
  if (!publicUrl) return null;

  try {
    // Check if it's our R2 proxy URL
    const marker = "/api/storage/r2/";
    const index = publicUrl.indexOf(marker);

    if (index !== -1) {
      return publicUrl.slice(index + marker.length);
    }

    // Fallback check for Supabase if some old URLs still exist
    const supabaseMarker = "/storage/v1/object/public/";
    const sIndex = publicUrl.indexOf(supabaseMarker);

    if (sIndex !== -1) {
      const rest = publicUrl.slice(sIndex + supabaseMarker.length);
      const parts = rest.split("/");
      // The first part is the bucket name, the rest is the path
      if (parts.length > 1) {
        return parts.slice(1).join("/");
      }
    }

    return null;
  } catch {
    return null;
  }
}
