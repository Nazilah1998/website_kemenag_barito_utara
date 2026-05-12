import { apiResponse } from "@/lib/prisma-helpers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAdmin } from "@/lib/cms-utils";
import {
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE_KB = 100;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

function cleanString(value = "") {
  return String(value || "").trim();
}

function normalizeSlug(value = "") {
  return cleanString(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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
    throw new Error("Format file galeri tidak valid.");
  }

  const base64Payload = match[2];
  const sizeBytes = Buffer.from(base64Payload, "base64").length;
  const sizeKB = Math.ceil(sizeBytes / 1024);

  if (sizeBytes > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(
      `Ukuran cover galeri setelah kompresi masih ${sizeKB} KB. Maksimal ${MAX_IMAGE_SIZE_KB} KB.`,
    );
  }

  return {
    sizeBytes,
    sizeKB,
    mimeType: match[1],
  };
}

function resolveLinkUrl(linkUrlInput = "", slug = "") {
  const cleanLink = cleanString(linkUrlInput);
  if (cleanLink) return cleanLink;
  return slug ? `/berita/${slug}` : "/berita";
}

function resolvePublishedAt(value) {
  const sourceValue = cleanString(value);
  const parsedDate = sourceValue ? new Date(sourceValue) : new Date();

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Tanggal publish galeri tidak valid.");
  }

  return parsedDate;
}

function revalidateGaleriPaths(slug = "") {
  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath("/galeri");
  revalidatePath("/admin");
  revalidatePath("/admin/berita");

  if (slug) {
    revalidatePath(`/berita/${slug}`);
  }
}

async function resolveGaleriImage({
  supabase,
  body,
  currentUrl = null,
  currentSizeKB = 0,
  currentSizeBytes = 0,
  beritaFallbackUrl = "",
  beritaFallbackSizeKB = 0,
  beritaFallbackSizeBytes = 0,
  slugSeed = "",
}) {
  const uploadBase64 = cleanString(body?.gallery_upload_base64);
  const uploadName = cleanString(body?.gallery_upload_name) || "galeri.webp";
  const requestedUrl = cleanString(body?.image_url);

  if (!uploadBase64) {
    const resolvedUrl = requestedUrl || currentUrl || "";

    if (resolvedUrl === currentUrl && currentUrl) {
      return {
        publicUrl: resolvedUrl,
        sizeKB: toSafeSizeNumber(currentSizeKB),
        sizeBytes: toSafeSizeNumber(currentSizeBytes),
      };
    }

    return {
      publicUrl: resolvedUrl,
      sizeKB: 0,
      sizeBytes: 0,
    };
  }

  const base64Meta = getBase64PayloadMeta(uploadBase64);

  const uploaded = await uploadBase64Image({
    supabase,
    dataUrl: uploadBase64,
    folder: "galeri",
    fileNameStem: slugSeed || uploadName,
  });

  if (currentUrl && currentUrl !== uploaded.publicUrl) {
    try {
      await removeStorageFileByPublicUrl(supabase, currentUrl);
    } catch (error) {
      console.error("Gagal menghapus cover galeri lama:", error);
    }
  }

  return {
    publicUrl: uploaded.publicUrl,
    sizeKB: base64Meta.sizeKB,
    sizeBytes: base64Meta.sizeBytes,
  };
}

export async function GET(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const beritaId = cleanString(searchParams.get("berita_id"));

    if (!beritaId) {
      return apiResponse({ message: "ID berita wajib ada." }, 400);
    }

    const data = await prisma.galeri.findUnique({
      where: {
        source_type_source_id: {
          source_type: "berita",
          source_id: beritaId
        }
      }
    });

    return apiResponse({
      item: data,
    });
  } catch (error) {
    console.error("GET Galeri-Berita Error:", error);
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

    const beritaId = cleanString(body?.berita_id);
    const title = cleanString(body?.title);
    const slug = normalizeSlug(body?.slug);
    const linkUrl = resolveLinkUrl(body?.link_url, slug);

    if (!beritaId) {
      return apiResponse({ message: "ID berita wajib ada." }, 400);
    }

    if (!title) {
      return apiResponse({ message: "Judul berita wajib ada." }, 400);
    }

    if (!slug) {
      return apiResponse({ message: "Slug berita wajib ada." }, 400);
    }

    const publishedAt = resolvePublishedAt(body?.published_at);

    const beritaItem = await prisma.berita.findUnique({
      where: { id: beritaId },
      select: { id: true, slug: true, cover_image: true, cover_size_kb: true, cover_size_bytes: true }
    });

    const existingItem = await prisma.galeri.findUnique({
      where: {
        source_type_source_id: {
          source_type: "berita",
          source_id: beritaId
        }
      }
    });

    const finalImage = await resolveGaleriImage({
      supabase,
      body,
      currentUrl: existingItem?.image_url || null,
      currentSizeKB: existingItem?.image_size_kb || 0,
      currentSizeBytes: Number(existingItem?.image_size_bytes || 0),
      beritaFallbackUrl: beritaItem?.cover_image || "",
      beritaFallbackSizeKB: beritaItem?.cover_size_kb || 0,
      beritaFallbackSizeBytes: Number(beritaItem?.cover_size_bytes || 0),
      slugSeed: slug || title,
    });

    if (!finalImage.publicUrl) {
      return apiResponse({ message: "Gambar galeri wajib diupload." }, 400);
    }

    if (existingItem) {
      const data = await prisma.galeri.update({
        where: { id: existingItem.id },
        data: {
          title,
          image_url: finalImage.publicUrl,
          image_size_kb: finalImage.sizeKB,
          image_size_bytes: BigInt(finalImage.sizeBytes),
          link_url: linkUrl,
          source_type: "berita",
          source_id: beritaId,
          is_published: true,
          published_at: publishedAt,
          updated_at: new Date(),
        }
      });

      revalidateGaleriPaths(slug);

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.GALERI,
        entityId: existingItem.id,
        summary: `Memperbarui item galeri dari berita "${title}"`,
        before: existingItem,
        after: data,
        request,
      });

      return apiResponse({
        message: `Item galeri berhasil diperbarui. Ukuran gambar aktif ${finalImage.sizeKB} KB.`,
        mode: "updated",
        gallery_id: existingItem.id,
      });
    }

    const insertedItem = await prisma.galeri.create({
      data: {
        title,
        image_url: finalImage.publicUrl,
        image_size_kb: finalImage.sizeKB,
        image_size_bytes: BigInt(finalImage.sizeBytes),
        link_url: linkUrl,
        source_type: "berita",
        source_id: beritaId,
        is_published: true,
        published_at: publishedAt,
      }
    });

    revalidateGaleriPaths(slug);

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.GALERI,
      entityId: insertedItem?.id ?? null,
      summary: `Menambah item galeri dari berita "${title}"`,
      after: insertedItem,
      request,
    });

    return apiResponse({
      message: `Berita berhasil dikirim ke galeri. Ukuran gambar tersimpan ${finalImage.sizeKB} KB.`,
      mode: "created",
      gallery_id: insertedItem?.id ?? null,
    });
  } catch (error) {
    console.error("API /api/admin/galeri/from-berita error:", error);

    return apiResponse(
      { message: error.message || "Gagal mengirim berita ke galeri." },
      500,
    );
  }
}

export async function DELETE(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = cleanString(searchParams.get("id"));

    if (!id) {
      return apiResponse({ message: "ID galeri wajib ada." }, 400);
    }

    const supabase = createAdminClient();

    const item = await prisma.galeri.findUnique({
      where: { id: id }
    });

    if (!item) {
      return apiResponse({ message: "Item galeri tidak ditemukan." }, 404);
    }

    if (item.image_url) {
      try {
        await removeStorageFileByPublicUrl(supabase, item.image_url);
      } catch (error) {
        console.error("Gagal menghapus file galeri dari storage:", error);
      }
    }

    await prisma.galeri.delete({
      where: { id: id }
    });

    revalidateGaleriPaths();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.GALERI,
      entityId: id,
      summary: `Menghapus item galeri "${item.title}"`,
      before: item,
      request,
    });

    return apiResponse({
      message: "Item galeri berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE Galeri-Berita Error:", error);
    return apiResponse(
      { message: error.message || "Gagal menghapus item galeri." },
      500,
    );
  }
}
