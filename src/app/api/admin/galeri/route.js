import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAdmin } from "@/lib/cms-utils";
import {
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { apiResponse } from "@/lib/prisma-helpers";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE_KB = 200;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

function cleanString(value = "") {
  return String(value || "").trim();
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
  if (!match) return null;

  const base64Payload = match[2];
  const sizeBytes = Buffer.from(base64Payload, "base64").length;
  const sizeKB = Math.ceil(sizeBytes / 1024);

  return {
    sizeBytes,
    sizeKB,
    mimeType: match[1],
  };
}

function revalidateGaleriPaths() {
  revalidatePath("/");
  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

export async function GET(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const data = await prisma.galeri.findMany({
      orderBy: { published_at: "desc" },
    });

    return apiResponse({
      items: data ?? [],
    });
  } catch (error) {
    console.error("GET Galeri Error:", error);
    return apiResponse(
      { message: error.message || "Gagal mengambil data galeri." },
      500,
    );
  }
}

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const uploadBase64 = cleanString(body?.gallery_upload_base64);
    const publishedAt = body?.published_at
      ? new Date(body.published_at)
      : new Date();

    if (!uploadBase64) {
      return apiResponse({ message: "Gambar galeri wajib diupload." }, 400);
    }

    const base64Meta = getBase64PayloadMeta(uploadBase64);
    if (!base64Meta) {
      return apiResponse({ message: "Format file tidak valid." }, 400);
    }

    if (base64Meta.sizeBytes > MAX_IMAGE_SIZE_BYTES) {
      return apiResponse(
        {
          message: `Ukuran file terlalu besar. Maksimal ${MAX_IMAGE_SIZE_KB} KB.`,
        },
        400,
      );
    }

    const uploaded = await uploadBase64Image({
      supabase,
      dataUrl: uploadBase64,
      folder: "galeri",
      fileNameStem: `galeri-${Date.now()}`,
    });

    const insertedItem = await prisma.galeri.create({
      data: {
        title: "",
        image_url: uploaded.publicUrl,
        image_size_kb: base64Meta.sizeKB,
        image_size_bytes: BigInt(base64Meta.sizeBytes),
        link_url: "",
        source_type: "manual",
        source_id: auth.session.user.id,
        is_published: true,
        published_at: publishedAt,
      },
    });

    revalidateGaleriPaths();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.GALERI,
      entityId: insertedItem?.id ?? null,
      summary: "Menambah item galeri baru secara manual",
      after: {
        image_url: uploaded.publicUrl,
        published_at: publishedAt,
      },
      request,
    });

    return apiResponse({
      message: "Item galeri berhasil disimpan.",
      item: insertedItem,
    });
  } catch (error) {
    console.error("POST /api/admin/galeri error:", error);
    return apiResponse(
      { message: error.message || "Gagal menyimpan galeri." },
      500,
    );
  }
}

export async function PUT(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return apiResponse({ message: "ID galeri wajib ada." }, 400);

    const body = await request.json();
    const supabase = createAdminClient();

    const existingItem = await prisma.galeri.findUnique({
      where: { id: id },
    });

    if (!existingItem)
      return apiResponse({ message: "Item tidak ditemukan." }, 404);

    const uploadBase64 = cleanString(body?.gallery_upload_base64);
    const publishedAt = body?.published_at
      ? new Date(body.published_at)
      : existingItem.published_at;

    let finalImageUrl = existingItem.image_url;
    let finalSizeKB = existingItem.image_size_kb;
    let finalSizeBytes = existingItem.image_size_bytes;

    if (uploadBase64) {
      const base64Meta = getBase64PayloadMeta(uploadBase64);
      if (!base64Meta) throw new Error("Format file tidak valid.");
      if (base64Meta.sizeBytes > MAX_IMAGE_SIZE_BYTES)
        throw new Error(`Maksimal ${MAX_IMAGE_SIZE_KB} KB.`);

      const uploaded = await uploadBase64Image({
        supabase,
        dataUrl: uploadBase64,
        folder: "galeri",
        fileNameStem: `galeri-${Date.now()}`,
      });

      if (existingItem.image_url) {
        await removeStorageFileByPublicUrl(
          supabase,
          existingItem.image_url,
        ).catch(console.error);
      }

      finalImageUrl = uploaded.publicUrl;
      finalSizeKB = base64Meta.sizeKB;
      finalSizeBytes = BigInt(base64Meta.sizeBytes);
    }

    const data = await prisma.galeri.update({
      where: { id: id },
      data: {
        image_url: finalImageUrl,
        image_size_kb: finalSizeKB,
        image_size_bytes: finalSizeBytes,
        published_at: publishedAt,
        source_id: auth.session.user.id,
        updated_at: new Date(),
      },
    });

    revalidateGaleriPaths();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.GALERI,
      entityId: id,
      summary: "Memperbarui item galeri secara manual",
      request,
    });

    return apiResponse({
      message: "Item galeri berhasil diperbarui.",
      item: data,
    });
  } catch (error) {
    console.error("PUT Galeri Error:", error);
    return apiResponse(
      { message: error.message || "Gagal update galeri." },
      500,
    );
  }
}

export async function DELETE(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return apiResponse({ message: "ID galeri wajib ada." }, 400);

    const supabase = createAdminClient();
    const item = await prisma.galeri.findUnique({
      where: { id: id },
    });

    if (!item) return apiResponse({ message: "Item tidak ditemukan." }, 404);

    if (item.image_url) {
      await removeStorageFileByPublicUrl(supabase, item.image_url).catch(
        console.error,
      );
    }

    await prisma.galeri.delete({
      where: { id: id },
    });

    revalidateGaleriPaths();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.GALERI,
      entityId: id,
      summary: "Menghapus item galeri",
      before: item,
      request,
    });

    return apiResponse({ message: "Item galeri berhasil dihapus." });
  } catch (error) {
    console.error("DELETE Galeri Error:", error);
    return apiResponse(
      { message: error.message || "Gagal menghapus galeri." },
      500,
    );
  }
}
