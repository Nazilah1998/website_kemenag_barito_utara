import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

const table = "pengumuman";

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
    throw createHttpError("Tanggal publish pengumuman tidak valid.");
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

export async function GET() {
  const auth = await validateAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(table)
      .select(selectFields)
      .order("is_important", { ascending: false })
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal mengambil daftar pengumuman." },
      { status: error.status || 500 },
    );
  }
}

export async function POST(request) {
  const auth = await validateAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const supabase = createAdminClient();
    const payload = buildPayload(body);

    const slug = await ensureUniqueSlug(
      supabase,
      table,
      cleanString(body.slug),
      payload.title,
    );

    const { data, error } = await supabase
      .from(table)
      .insert({
        ...payload,
        slug,
        author_id: auth.session.profile?.id ?? null,
      })
      .select(selectFields)
      .single();

    if (error) {
      throw error;
    }

    revalidatePengumumanPaths(data?.slug);

    return NextResponse.json(
      {
        message: "Pengumuman berhasil ditambahkan.",
        item: data,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal menambahkan pengumuman." },
      { status: error.status || 500 },
    );
  }
}
