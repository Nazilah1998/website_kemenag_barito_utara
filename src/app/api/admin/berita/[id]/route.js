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

const selectFields = `
  id,
  slug,
  title,
  excerpt,
  category,
  content,
  cover_image,
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

async function resolveCoverImage({
  supabase,
  body,
  currentUrl = null,
  slugSeed = "",
}) {
  const uploadBase64 = cleanString(body?.cover_upload_base64);
  const uploadName = cleanString(body?.cover_upload_name) || "cover.webp";
  const currentCover = cleanString(body?.cover_image) || currentUrl || null;

  if (!uploadBase64) {
    return currentCover;
  }

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

  return uploaded.publicUrl;
}

async function buildPayload(supabase, body, currentCoverUrl = null) {
  const title = cleanString(body?.title);
  const content = cleanString(body?.content);
  const excerpt =
    cleanString(body?.excerpt) || buildExcerptFromHtml(content, 180);
  const category = cleanString(body?.category) || "Umum";
  const is_published = Boolean(body?.is_published);
  const publishedAtInput = cleanString(body?.published_at);

  if (!title) {
    throw createHttpError("Judul berita wajib diisi.", 400);
  }

  if (!content) {
    throw createHttpError("Isi berita wajib diisi.", 400);
  }

  const publishedAt = publishedAtInput
    ? new Date(publishedAtInput)
    : new Date();

  if (Number.isNaN(publishedAt.getTime())) {
    throw createHttpError("Tanggal publish tidak valid.", 400);
  }

  const coverImage = await resolveCoverImage({
    supabase,
    body,
    currentUrl: currentCoverUrl,
    slugSeed: cleanString(body?.slug) || title,
  });

  if (!coverImage) {
    throw createHttpError("Cover berita wajib diupload.", 400);
  }

  return {
    title,
    excerpt,
    category,
    content,
    cover_image: coverImage,
    is_published,
    published_at: publishedAt.toISOString(),
  };
}

async function syncRelatedGaleriMetadata(supabase, beritaItem) {
  const { data: galeriItem, error: lookupError } = await supabase
    .from("galeri")
    .select("id, image_url")
    .eq("source_type", "berita")
    .eq("source_id", beritaItem.id)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (!galeriItem) {
    return;
  }

  const patch = {
    title: beritaItem.title,
    link_url: `/berita/${beritaItem.slug}`,
    is_published: Boolean(beritaItem.is_published),
    published_at: beritaItem.published_at,
    updated_at: new Date().toISOString(),
  };

  if (!galeriItem.image_url) {
    patch.image_url = beritaItem.cover_image;
  }

  const { error: updateError } = await supabase
    .from("galeri")
    .update(patch)
    .eq("id", galeriItem.id);

  if (updateError) {
    throw updateError;
  }
}

export async function PUT(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const safeId = cleanString(id);

    if (!safeId) {
      throw createHttpError("ID berita tidak valid.", 400);
    }

    const body = await request.json();
    const supabase = createAdminClient();

    const { data: existingItem, error: existingError } = await supabase
      .from(table)
      .select("id, slug, cover_image")
      .eq("id", safeId)
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existingItem) throw createHttpError("Berita tidak ditemukan.", 404);

    const payload = await buildPayload(
      supabase,
      body,
      existingItem.cover_image || null,
    );

    const slug = await ensureUniqueSlug(
      supabase,
      table,
      cleanString(body?.slug) || payload.title,
      payload.title,
      safeId,
    );

    const { data, error } = await supabase
      .from(table)
      .update({
        ...payload,
        slug,
      })
      .eq("id", safeId)
      .select(selectFields)
      .single();

    if (error) throw error;

    await syncRelatedGaleriMetadata(supabase, data);

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/galeri");
    revalidatePath("/admin/berita");
    revalidatePath(`/berita/${data.slug}`);

    if (existingItem.slug && existingItem.slug !== data.slug) {
      revalidatePath(`/berita/${existingItem.slug}`);
    }

    return NextResponse.json({
      message: "Berita berhasil diperbarui.",
      item: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Gagal memperbarui berita.",
      },
      {
        status: error.status || 500,
      },
    );
  }
}

export async function DELETE(_request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const safeId = cleanString(id);

    if (!safeId) {
      throw createHttpError("ID berita tidak valid.", 400);
    }

    const supabase = createAdminClient();

    const { data: existingItem, error: existingError } = await supabase
      .from(table)
      .select("id, slug, cover_image")
      .eq("id", safeId)
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existingItem) throw createHttpError("Berita tidak ditemukan.", 404);

    const { data: relatedGalleryRows, error: galleryLookupError } =
      await supabase
        .from("galeri")
        .select("id, image_url")
        .eq("source_type", "berita")
        .eq("source_id", safeId);

    if (galleryLookupError) {
      throw galleryLookupError;
    }

    const { error: galleryDeleteError } = await supabase
      .from("galeri")
      .delete()
      .eq("source_type", "berita")
      .eq("source_id", safeId);

    if (galleryDeleteError) {
      throw galleryDeleteError;
    }

    const { error: beritaDeleteError } = await supabase
      .from(table)
      .delete()
      .eq("id", safeId);

    if (beritaDeleteError) {
      throw beritaDeleteError;
    }

    try {
      if (existingItem.cover_image) {
        await removeStorageFileByPublicUrl(supabase, existingItem.cover_image);
      }

      for (const row of relatedGalleryRows || []) {
        if (row?.image_url) {
          await removeStorageFileByPublicUrl(supabase, row.image_url);
        }
      }
    } catch (cleanupError) {
      console.error("Storage cleanup warning:", cleanupError);
    }

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/galeri");
    revalidatePath("/admin/berita");

    if (existingItem.slug) {
      revalidatePath(`/berita/${existingItem.slug}`);
    }

    return NextResponse.json({
      message: "Berita berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Gagal menghapus berita.",
      },
      {
        status: error.status || 500,
      },
    );
  }
}
