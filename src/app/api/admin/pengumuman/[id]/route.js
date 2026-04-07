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
  created_at,
  updated_at
`;

function buildPayload(body) {
  const title = cleanString(body.title);
  const excerpt = cleanString(body.excerpt);
  const content = cleanString(body.content);
  const category = cleanString(body.category) || "Informasi";
  const isImportant = Boolean(body.is_important);
  const isPublished = Boolean(body.is_published);
  const publishedAtInput = cleanString(body.published_at);

  if (!title) throw new Error("Judul pengumuman wajib diisi.");
  if (!excerpt) throw new Error("Ringkasan pengumuman wajib diisi.");
  if (!content) throw new Error("Isi pengumuman wajib diisi.");

  const publishedAt = publishedAtInput ? new Date(publishedAtInput) : new Date();
  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error("Tanggal publish tidak valid.");
  }

  return {
    title,
    excerpt,
    content,
    category,
    is_important: isImportant,
    is_published: isPublished,
    published_at: publishedAt.toISOString(),
  };
}

export async function PUT(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = createAdminClient();
    const payload = buildPayload(body);
    const slug = await ensureUniqueSlug(
      supabase,
      table,
      cleanString(body.slug),
      payload.title,
      id
    );

    const { data, error } = await supabase
      .from(table)
      .update({ ...payload, slug })
      .eq("id", id)
      .select(selectFields)
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Pengumuman berhasil diperbarui.",
      item: data,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal memperbarui pengumuman." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const supabase = createAdminClient();

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ message: "Pengumuman berhasil dihapus." });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal menghapus pengumuman." },
      { status: 500 }
    );
  }
}