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
      .order("start_at", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      items: data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Gagal mengambil daftar agenda.",
      },
      {
        status: 500,
      }
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
      payload.title
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

    return NextResponse.json(
      {
        message: "Agenda berhasil ditambahkan.",
        item: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Gagal menambahkan agenda.",
      },
      {
        status: 500,
      }
    );
  }
}