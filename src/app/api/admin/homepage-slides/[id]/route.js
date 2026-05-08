import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminAccess } from "@/lib/admin-guard";
import {
  isCmsStoragePublicUrl,
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";
import { normalizeHomepageSlide } from "@/lib/homepage-slides";

export const dynamic = "force-dynamic";

function toText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return fallback;
}

async function getExistingSlide(supabase, id) {
  const { data, error } = await supabase
    .from("homepage_slides")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function PATCH(request, { params }) {
  const access = await requireAdminAccess();
  if (!access?.ok) {
    return NextResponse.json(
      { message: access?.message || "Akses ditolak." },
      { status: access?.status || 403 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "ID slide tidak valid." },
      { status: 400 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const supabase = createAdminClient();

    const existing = await getExistingSlide(supabase, id);
    if (!existing) {
      return NextResponse.json(
        { message: "Slide tidak ditemukan." },
        { status: 404 },
      );
    }

    const title = toText(body?.title, existing.title || "");
    const caption = toText(body?.caption, existing.caption || "");
    const imageUrlRaw = toText(body?.image_url, existing.image_url || "");
    const imageUploadBase64 = toText(body?.image_upload_base64, "");
    const imageUploadName = toText(body?.image_upload_name, title || "slide");
    const isPublished = toBool(body?.is_published, existing.is_published);
    const sortOrder = toNumber(body?.sort_order, existing.sort_order);
    const category = toText(body?.category, existing.category || "utama");

    if (!title) {
      return NextResponse.json(
        { message: "Judul slide wajib diisi." },
        { status: 400 },
      );
    }

    let finalImageUrl = imageUrlRaw;

    if (imageUploadBase64) {
      const uploaded = await uploadBase64Image({
        dataUrl: imageUploadBase64,
        folder: "homepage-slides",
        fileNameStem: imageUploadName || title,
      });
      finalImageUrl = uploaded?.publicUrl || "";

      if (
        existing.image_url &&
        existing.image_url !== finalImageUrl &&
        isCmsStoragePublicUrl(existing.image_url)
      ) {
        await removeStorageFileByPublicUrl(supabase, existing.image_url).catch(
          () => null,
        );
      }
    }

    if (!finalImageUrl) {
      return NextResponse.json(
        { message: "Gambar slide wajib diupload." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("homepage_slides")
      .update({
        title,
        caption,
        image_url: finalImageUrl,
        category,
        is_published: isPublished,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Slide beranda berhasil diperbarui.",
      item: normalizeHomepageSlide(data || {}),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal memperbarui slide beranda." },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const access = await requireAdminAccess();
  if (!access?.ok) {
    return NextResponse.json(
      { message: access?.message || "Akses ditolak." },
      { status: access?.status || 403 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "ID slide tidak valid." },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();

    const existing = await getExistingSlide(supabase, id);
    if (!existing) {
      return NextResponse.json(
        { message: "Slide tidak ditemukan." },
        { status: 404 },
      );
    }

    const { error } = await supabase
      .from("homepage_slides")
      .delete()
      .eq("id", id);
    if (error) throw error;

    if (existing.image_url && isCmsStoragePublicUrl(existing.image_url)) {
      await removeStorageFileByPublicUrl(supabase, existing.image_url).catch(
        () => null,
      );
    }

    return NextResponse.json({
      message: "Slide beranda berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal menghapus slide beranda." },
      { status: 500 },
    );
  }
}
