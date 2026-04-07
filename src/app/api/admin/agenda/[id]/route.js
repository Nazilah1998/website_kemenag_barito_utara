import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

const table = "agenda";

const selectFields = `
  id,
  slug,
  title,
  description,
  category,
  status,
  location,
  start_at,
  end_at,
  is_published,
  author_id,
  created_at,
  updated_at
`;

function buildPayload(body) {
  const title = cleanString(body.title);
  const description = cleanString(body.description);
  const category = cleanString(body.category) || "Kegiatan";
  const status = cleanString(body.status) || "Terjadwal";
  const location = cleanString(body.location);
  const startAtInput = cleanString(body.start_at);
  const endAtInput = cleanString(body.end_at);
  const isPublished = Boolean(body.is_published);

  if (!title) {
    throw new Error("Judul agenda wajib diisi.");
  }

  if (!description) {
    throw new Error("Deskripsi agenda wajib diisi.");
  }

  if (!startAtInput) {
    throw new Error("Tanggal mulai agenda wajib diisi.");
  }

  const startAt = new Date(startAtInput);

  if (Number.isNaN(startAt.getTime())) {
    throw new Error("Tanggal mulai agenda tidak valid.");
  }

  let endAt = null;

  if (endAtInput) {
    const parsedEndAt = new Date(endAtInput);

    if (Number.isNaN(parsedEndAt.getTime())) {
      throw new Error("Tanggal selesai agenda tidak valid.");
    }

    endAt = parsedEndAt.toISOString();
  }

  return {
    title,
    description,
    category,
    status,
    location,
    start_at: startAt.toISOString(),
    end_at: endAt,
    is_published: isPublished,
  };
}

export async function PUT(request, { params }) {
  const auth = await validateAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = params;
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

    return NextResponse.json({
      message: "Agenda berhasil diperbarui.",
      item: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Gagal memperbarui agenda.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_request, { params }) {
  const auth = await validateAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = params;
    const supabase = createAdminClient();

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Agenda berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Gagal menghapus agenda.",
      },
      {
        status: 500,
      }
    );
  }
}