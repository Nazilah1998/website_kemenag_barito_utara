import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminAccess } from "@/lib/admin-guard";
import { uploadBase64Image } from "@/lib/storage-media";
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

export async function GET() {
  const access = await requireAdminAccess();
  if (!access?.ok) {
    return NextResponse.json(
      { message: access?.message || "Akses ditolak." },
      { status: access?.status || 403 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("homepage_slides")
      .select(
        "id, title, caption, image_url, is_published, sort_order, created_at, updated_at",
      )
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      items: (data || []).map(normalizeHomepageSlide),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal memuat data slider beranda." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const access = await requireAdminAccess();
  if (!access?.ok) {
    return NextResponse.json(
      { message: access?.message || "Akses ditolak." },
      { status: access?.status || 403 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));

    const title = toText(body?.title, "");
    const caption = toText(body?.caption, "");
    const imageUrlRaw = toText(body?.image_url, "");
    const imageUploadBase64 = toText(body?.image_upload_base64, "");
    const imageUploadName = toText(body?.image_upload_name, "homepage-slide");
    const isPublished = toBool(body?.is_published, true);
    const sortOrder = toNumber(body?.sort_order, 0);

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
    }

    if (!finalImageUrl) {
      return NextResponse.json(
        { message: "Gambar slide wajib diupload." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("homepage_slides")
      .insert({
        title,
        caption,
        image_url: finalImageUrl,
        is_published: isPublished,
        sort_order: sortOrder,
      })
      .select(
        "id, title, caption, image_url, is_published, sort_order, created_at, updated_at",
      )
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Slide beranda berhasil ditambahkan.",
      item: normalizeHomepageSlide(data || {}),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal menambahkan slide beranda." },
      { status: 500 },
    );
  }
}
