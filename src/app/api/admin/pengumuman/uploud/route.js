import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["application/pdf", "pdf"],
]);

function getBucketName() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_PENGUMUMAN ||
    process.env.SUPABASE_STORAGE_BUCKET_PENGUMUMAN ||
    "pengumuman-files"
  );
}

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function getAttachmentType(file) {
  if (!file?.type) return "other";
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  return "other";
}

function getSafeFileExtension(file) {
  const extensionFromMime = ALLOWED_MIME_TYPES.get(file.type);
  if (extensionFromMime) return extensionFromMime;

  const originalName = typeof file.name === "string" ? file.name : "";
  const fromName = originalName.split(".").pop()?.toLowerCase();

  return fromName || "bin";
}

function buildStoragePath(file) {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const extension = getSafeFileExtension(file);
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  return `attachments/${year}/${month}/${filename}`;
}

function mapUploadError(error, bucketName) {
  const message = error?.message || "Gagal upload lampiran.";
  const normalized = String(message).toLowerCase();

  if (
    normalized.includes("bucket") &&
    (normalized.includes("not found") || normalized.includes("does not exist"))
  ) {
    return `Bucket storage "${bucketName}" belum ada. Buat bucket public dengan nama tersebut di Supabase Storage.`;
  }

  return message;
}

export async function POST(request) {
  const auth = await validateAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw createHttpError("File lampiran belum dipilih.", 400);
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw createHttpError(
        "Format file tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau PDF.",
        400,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw createHttpError("Ukuran file maksimal 8 MB.", 400);
    }

    const supabase = createAdminClient();
    const bucketName = getBucketName();
    const storagePath = buildStoragePath(file);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, buffer, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw createHttpError(mapUploadError(uploadError, bucketName), 500);
    }

    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);
    const publicUrl = data?.publicUrl || "";

    if (!publicUrl) {
      throw createHttpError(
        "Upload berhasil, tetapi URL publik gagal dibuat.",
        500,
      );
    }

    return NextResponse.json({
      message: "Lampiran berhasil diupload.",
      item: {
        attachment_url: publicUrl,
        attachment_name: file.name,
        attachment_path: storagePath,
        attachment_source: "upload",
        attachment_type: getAttachmentType(file),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal upload lampiran." },
      { status: error.status || 500 },
    );
  }
}
