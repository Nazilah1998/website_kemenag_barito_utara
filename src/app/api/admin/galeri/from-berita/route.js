import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAdmin } from "@/lib/cms-utils";
import {
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";

export const dynamic = "force-dynamic";

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
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

async function resolveGaleriImage({
  supabase,
  body,
  currentUrl = null,
  slugSeed = "",
}) {
  const uploadBase64 = cleanString(body?.gallery_upload_base64);
  const uploadName = cleanString(body?.gallery_upload_name) || "galeri.webp";
  const existingUrl = cleanString(body?.image_url) || currentUrl || "";

  if (!uploadBase64) {
    return existingUrl;
  }

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

  return uploaded.publicUrl;
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

    return NextResponse.json({
      item: data ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Gagal mengambil data galeri.",
      },
      {
        status: error.status || 500,
      },
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
    const linkUrl = cleanString(body?.link_url) || `/berita/${slug}`;

    if (!beritaId) {
      throw createHttpError("ID berita wajib ada.", 400);
    }

    if (!title) {
      throw createHttpError("Judul berita wajib ada.", 400);
    }

    if (!slug) {
      throw createHttpError("Slug berita wajib ada.", 400);
    }

    const publishedAtInput = cleanString(body?.published_at);
    const publishedAt = publishedAtInput
      ? new Date(publishedAtInput)
      : new Date();

    if (Number.isNaN(publishedAt.getTime())) {
      throw createHttpError("Tanggal publish galeri tidak valid.", 400);
    }

    const { data: existingItem, error: existingError } = await supabase
      .from("galeri")
      .select("id, image_url")
      .eq("source_type", "berita")
      .eq("source_id", beritaId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    const finalImageUrl = await resolveGaleriImage({
      supabase,
      body,
      currentUrl: existingItem?.image_url || null,
      slugSeed: slug || title,
    });

    if (!finalImageUrl) {
      throw createHttpError("Gambar galeri wajib diupload.", 400);
    }

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("galeri")
        .update({
          title,
          image_url: finalImageUrl,
          link_url: linkUrl,
          source_type: "berita",
          source_id: beritaId,
          is_published: true,
          published_at: publishedAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (updateError) {
        throw updateError;
      }

      revalidatePath("/");
      revalidatePath("/berita");
      revalidatePath(`/berita/${slug}`);
      revalidatePath("/galeri");
      revalidatePath("/admin/berita");

      return NextResponse.json({
        message: "Item galeri berhasil diperbarui.",
        mode: "updated",
        gallery_id: existingItem.id,
      });
    }

    const { data: insertedItem, error: insertError } = await supabase
      .from("galeri")
      .insert({
        title,
        image_url: finalImageUrl,
        link_url: linkUrl,
        source_type: "berita",
        source_id: beritaId,
        is_published: true,
        published_at: publishedAt.toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      throw insertError;
    }

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/berita/${slug}`);
    revalidatePath("/galeri");
    revalidatePath("/admin/berita");

    return NextResponse.json({
      message: "Berita berhasil dikirim ke galeri.",
      mode: "created",
      gallery_id: insertedItem?.id ?? null,
    });
  } catch (error) {
    console.error("API /api/admin/galeri/from-berita error:", error);

    return NextResponse.json(
      {
        message: error.message || "Gagal mengirim berita ke galeri.",
      },
      {
        status: error.status || 500,
      },
    );
  }
}
