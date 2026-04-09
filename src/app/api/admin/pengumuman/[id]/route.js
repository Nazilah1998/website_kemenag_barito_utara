import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

const table = "pengumuman";
const BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_PENGUMUMAN ||
  process.env.SUPABASE_STORAGE_BUCKET_PENGUMUMAN ||
  "pengumuman-files";

const selectFields = `
  id,
  slug,
  title,
  excerpt,
  content,
  category,
  is_important,
  is_published,
  published_at,
  author_id,
  attachment_url,
  attachment_name,
  attachment_path,
  attachment_source,
  attachment_type,
  created_at,
  updated_at
`;

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function inferAttachmentTypeFromUrl(url) {
  const lower = String(url || "").toLowerCase();

  if (lower.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/)) return "image";
  if (lower.match(/\.pdf(\?|$)/)) return "pdf";
  if (lower.includes("drive.google.com")) return "link";

  return "link";
}

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || ""),
  );
}

async function resolveId(params) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id || !isValidUuid(id)) {
    throw createHttpError("ID pengumuman tidak valid.", 400);
  }

  return id;
}

function normalizeAttachment(body) {
  const attachmentUrl = cleanString(body.attachment_url);
  const attachmentName = cleanString(body.attachment_name);
  const attachmentPath = cleanString(body.attachment_path);
  const attachmentSource = cleanString(body.attachment_source);
  const attachmentType = cleanString(body.attachment_type);

  if (!attachmentUrl) {
    return {
      attachment_url: null,
      attachment_name: null,
      attachment_path: null,
      attachment_source: null,
      attachment_type: null,
    };
  }

  return {
    attachment_url: attachmentUrl,
    attachment_name: attachmentName || "Lampiran Pengumuman",
    attachment_path: attachmentPath || null,
    attachment_source: attachmentSource || (attachmentPath ? "upload" : "link"),
    attachment_type:
      attachmentType || inferAttachmentTypeFromUrl(attachmentUrl),
  };
}

function buildPayload(body) {
  const title = cleanString(body.title);
  const excerpt = cleanString(body.excerpt);
  const content = cleanString(body.content);
  const category = cleanString(body.category) || "Informasi";
  const isImportant = Boolean(body.is_important);
  const isPublished = Boolean(body.is_published);
  const publishedAtInput = cleanString(body.published_at);

  if (!title) {
    throw createHttpError("Judul pengumuman wajib diisi.");
  }

  if (!excerpt) {
    throw createHttpError("Ringkasan pengumuman wajib diisi.");
  }

  if (!content) {
    throw createHttpError("Isi pengumuman wajib diisi.");
  }

  const publishedAt = publishedAtInput
    ? new Date(publishedAtInput)
    : new Date();

  if (Number.isNaN(publishedAt.getTime())) {
    throw createHttpError("Tanggal publish tidak valid.");
  }

  return {
    title,
    excerpt,
    content,
    category,
    is_important: isImportant,
    is_published: isPublished,
    published_at: publishedAt.toISOString(),
    ...normalizeAttachment(body),
  };
}

function revalidatePengumumanPaths(slug) {
  revalidatePath("/");
  revalidatePath("/pengumuman");
  revalidatePath("/admin/pengumuman");

  if (slug) {
    revalidatePath(`/pengumuman/${slug}`);
  }
}

export async function PUT(request, { params }) {
  const auth = await validateAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const id = await resolveId(params);
    const body = await request.json();
    const supabase = createAdminClient();

    const { data: existingItem, error: existingError } = await supabase
      .from(table)
      .select("id, slug, attachment_path, attachment_source")
      .eq("id", id)
      .single();

    if (existingError) {
      throw existingError;
    }

    const payload = buildPayload(body);

    const slug = await ensureUniqueSlug(
      supabase,
      table,
      cleanString(body.slug),
      payload.title,
      id,
    );

    const nextAttachmentPath = payload.attachment_path;
    const nextAttachmentSource = payload.attachment_source;

    const shouldRemoveOldUpload =
      existingItem?.attachment_source === "upload" &&
      existingItem?.attachment_path &&
      (!nextAttachmentPath ||
        nextAttachmentSource !== "upload" ||
        existingItem.attachment_path !== nextAttachmentPath);

    if (shouldRemoveOldUpload) {
      await supabase.storage
        .from(BUCKET)
        .remove([existingItem.attachment_path]);
    }

    const { data, error } = await supabase
      .from(table)
      .update({
        ...payload,
        slug,
      })
      .eq("id", id)
      .select(selectFields)
      .single();

    if (error) {
      throw error;
    }

    revalidatePengumumanPaths(data?.slug);

    if (existingItem?.slug && existingItem.slug !== data?.slug) {
      revalidatePath(`/pengumuman/${existingItem.slug}`);
    }

    return NextResponse.json({
      message: "Pengumuman berhasil diperbarui.",
      item: data,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal memperbarui pengumuman." },
      { status: error.status || 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  const auth = await validateAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const id = await resolveId(params);
    const supabase = createAdminClient();

    const { data: currentData, error: fetchError } = await supabase
      .from(table)
      .select("slug, attachment_path, attachment_source")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (
      currentData?.attachment_source === "upload" &&
      currentData?.attachment_path
    ) {
      await supabase.storage.from(BUCKET).remove([currentData.attachment_path]);
    }

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidatePengumumanPaths(currentData?.slug);

    return NextResponse.json({
      message: "Pengumuman berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal menghapus pengumuman." },
      { status: error.status || 500 },
    );
  }
}
