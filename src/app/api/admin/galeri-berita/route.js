import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAdmin } from "@/lib/cms-utils";
import {
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE_KB = 100;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

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
    throw createHttpError("Format file galeri tidak valid.", 400);
  }

  const base64Payload = match[2];
  const sizeBytes = Buffer.from(base64Payload, "base64").length;
  const sizeKB = Math.ceil(sizeBytes / 1024);

  if (sizeBytes > MAX_IMAGE_SIZE_BYTES) {
    throw createHttpError(
      `Ukuran cover galeri setelah kompresi masih ${sizeKB} KB. Maksimal ${MAX_IMAGE_SIZE_KB} KB.`,
      400,
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
    throw createHttpError("Tanggal publish galeri tidak valid.", 400);
  }

  return parsedDate.toISOString();
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
      throw createHttpError("ID berita wajib ada.", 400);
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("galeri")
      .select(
        `
          id,
          title,
          image_url,
          image_size_kb,
          image_size_bytes,
          link_url,
          published_at,
          source_type,
          source_id,
          is_published
        `,
      )
      .eq("source_type", "berita")
      .eq("source_id", beritaId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return createNoStoreResponse({
      item: data ?? null,
    });
  } catch (error) {
    return createNoStoreResponse(
      {
        message: error.message || "Gagal mengambil data galeri.",
      },
      error.status || 500,
    );
  }
}

export async function POST(request) {
  console.log("POST /api/admin/galeri-berita hit");
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
      throw createHttpError("ID berita wajib ada.", 400);
    }

    if (!title) {
      throw createHttpError("Judul berita wajib ada.", 400);
    }

    if (!slug) {
      throw createHttpError("Slug berita wajib ada.", 400);
    }

    const publishedAtIso = resolvePublishedAt(body?.published_at);

    const { data: beritaItem, error: beritaLookupError } = await supabase
      .from("berita")
      .select("id, slug, cover_image, cover_size_kb, cover_size_bytes")
      .eq("id", beritaId)
      .maybeSingle();

    if (beritaLookupError) {
      throw beritaLookupError;
    }

    const { data: existingItem, error: existingError } = await supabase
      .from("galeri")
      .select("id, image_url, image_size_kb, image_size_bytes")
      .eq("source_type", "berita")
      .eq("source_id", beritaId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    const finalImage = await resolveGaleriImage({
      supabase,
      body,
      currentUrl: existingItem?.image_url || null,
      currentSizeKB: existingItem?.image_size_kb || 0,
      currentSizeBytes: existingItem?.image_size_bytes || 0,
      beritaFallbackUrl: beritaItem?.cover_image || "",
      beritaFallbackSizeKB: beritaItem?.cover_size_kb || 0,
      beritaFallbackSizeBytes: beritaItem?.cover_size_bytes || 0,
      slugSeed: slug || title,
    });

    if (!finalImage.publicUrl) {
      throw createHttpError("Gambar galeri wajib diupload.", 400);
    }

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("galeri")
        .update({
          title,
          image_url: finalImage.publicUrl,
          image_size_kb: finalImage.sizeKB,
          image_size_bytes: finalImage.sizeBytes,
          link_url: linkUrl,
          source_type: "berita",
          source_id: beritaId,
          is_published: true,
          published_at: publishedAtIso,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (updateError) {
        throw updateError;
      }

      revalidateGaleriPaths(slug);

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.GALERI,
        entityId: existingItem.id,
        summary: `Memperbarui item galeri dari berita "${title}"`,
        before: {
          image_url: existingItem?.image_url || null,
          image_size_kb: existingItem?.image_size_kb || 0,
          image_size_bytes: existingItem?.image_size_bytes || 0,
          source_type: "berita",
          source_id: beritaId,
        },
        after: {
          title,
          image_url: finalImage.publicUrl,
          image_size_kb: finalImage.sizeKB,
          image_size_bytes: finalImage.sizeBytes,
          link_url: linkUrl,
          source_type: "berita",
          source_id: beritaId,
          is_published: true,
          published_at: publishedAtIso,
        },
        request,
      });

      return createNoStoreResponse({
        message: `Item galeri berhasil diperbarui. Ukuran gambar aktif ${finalImage.sizeKB} KB.`,
        mode: "updated",
        gallery_id: existingItem.id,
      });
    }

    const { data: insertedItem, error: insertError } = await supabase
      .from("galeri")
      .insert({
        title,
        image_url: finalImage.publicUrl,
        image_size_kb: finalImage.sizeKB,
        image_size_bytes: finalImage.sizeBytes,
        link_url: linkUrl,
        source_type: "berita",
        source_id: beritaId,
        is_published: true,
        published_at: publishedAtIso,
      })
      .select("id")
      .single();

    if (insertError) {
      throw insertError;
    }

    revalidateGaleriPaths(slug);

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.GALERI,
      entityId: insertedItem?.id ?? null,
      summary: `Menambah item galeri dari berita "${title}"`,
      after: {
        title,
        image_url: finalImage.publicUrl,
        image_size_kb: finalImage.sizeKB,
        image_size_bytes: finalImage.sizeBytes,
        link_url: linkUrl,
        source_type: "berita",
        source_id: beritaId,
        is_published: true,
        published_at: publishedAtIso,
      },
      request,
    });

    return createNoStoreResponse({
      message: `Berita berhasil dikirim ke galeri. Ukuran gambar tersimpan ${finalImage.sizeKB} KB.`,
      mode: "created",
      gallery_id: insertedItem?.id ?? null,
    });
  } catch (error) {
    console.error("API /api/admin/galeri/from-berita error:", error);

    return createNoStoreResponse(
      {
        message: error.message || "Gagal mengirim berita ke galeri.",
      },
      error.status || 500,
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
      throw createHttpError("ID galeri wajib ada.", 400);
    }

    const supabase = createAdminClient();

    const { data: item, error: lookupError } = await supabase
      .from("galeri")
      .select("id, title, image_url, source_id")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) throw lookupError;
    if (!item) {
      throw createHttpError("Item galeri tidak ditemukan.", 404);
    }

    // Hapus file dari storage
    if (item.image_url) {
      try {
        await removeStorageFileByPublicUrl(supabase, item.image_url);
      } catch (error) {
        console.error("Gagal menghapus file galeri dari storage:", error);
      }
    }

    // Hapus record dari database
    const { error: deleteError } = await supabase
      .from("galeri")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

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

    return createNoStoreResponse({
      message: "Item galeri berhasil dihapus.",
    });
  } catch (error) {
    return createNoStoreResponse(
      {
        message: error.message || "Gagal menghapus item galeri.",
      },
      error.status || 500,
    );
  }
}
