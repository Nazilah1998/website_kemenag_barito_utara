import { uploadToR2, deleteFromR2, getR2PublicUrl } from "./r2";
import { createAdminClient } from "./supabase/admin";
import { logError } from "@/lib/logger";

export const CMS_MEDIA_BUCKET: string =
  process.env.NEXT_PUBLIC_SUPABASE_CMS_BUCKET || "cms-media";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadBase64Image({
  dataUrl,
  folder = "berita",
  fileNameStem = "image",
}: {
  dataUrl: string;
  folder?: string;
  fileNameStem?: string;
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
}: {
  dataUrl: string;
  folder?: string;
  fileNameStem?: string;
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

export async function removeSupabaseFileByPublicUrl(publicUrl = ""): Promise<boolean> {
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
    logError("supabase_storage_delete_failed", { error: error as Error });
    return false;
  }

  return true;
}

export async function removeStorageFileByPublicUrl(publicUrl: string): Promise<boolean> {
  const path = extractStoragePathFromPublicUrl(publicUrl);

  if (!path) {
    return false;
  }

  await deleteFromR2(path);

  return true;
}

export function isCmsStoragePublicUrl(value = ""): boolean {
  return extractStoragePathFromPublicUrl(value) !== null;
}

function parseDataUrl(dataUrl = ""): { mimeType: string; buffer: Buffer } {
  const match = String(dataUrl || "").match(/^data:(.+?);base64,(.+)$/);

  if (!match) {
    throw new Error("Format base64 gambar tidak valid.");
  }

  const mimeType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");

  return { mimeType, buffer };
}

function mimeTypeToExt(mimeType = ""): string {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  throw new Error("Mime type gambar tidak didukung.");
}

function sanitizeSegment(value = ""): string {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildStoragePath(folder: string, fileNameStem: string, ext: string): string {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const safeFolder = sanitizeSegment(folder) || "media";
  const safeStem = sanitizeSegment(fileNameStem) || "image";
  const unique = `${Date.now()}-${crypto.randomUUID()}`;

  return `${safeFolder}/${year}/${month}/${safeStem}-${unique}.${ext}`;
}

function extractStoragePathFromPublicUrl(publicUrl = ""): string | null {
  if (!publicUrl) return null;

  try {
    const marker = "/api/storage/r2/";
    const index = publicUrl.indexOf(marker);

    if (index !== -1) {
      return publicUrl.slice(index + marker.length);
    }

    const supabaseMarker = "/storage/v1/object/public/";
    const sIndex = publicUrl.indexOf(supabaseMarker);

    if (sIndex !== -1) {
      const rest = publicUrl.slice(sIndex + supabaseMarker.length);
      const parts = rest.split("/");
      if (parts.length > 1) {
        return parts.slice(1).join("/");
      }
    }

    return null;
  } catch {
    return null;
  }
}
