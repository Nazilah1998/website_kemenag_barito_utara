import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

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
  author_id,
  created_at,
  updated_at
`;

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value) {
  return cleanString(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildPayload(body) {
  const title = cleanString(body.title);
  const excerpt = cleanString(body.excerpt);
  const category = cleanString(body.category) || "Umum";
  const content = cleanString(body.content);
  const coverImage = cleanString(body.cover_image) || null;
  const isPublished = Boolean(body.is_published);
  const publishedAtInput = cleanString(body.published_at);

  if (!title) throw new Error("Judul berita wajib diisi.");
  if (!excerpt) throw new Error("Ringkasan berita wajib diisi.");
  if (!content) throw new Error("Isi berita wajib diisi.");

  const publishedAt = publishedAtInput ? new Date(publishedAtInput) : new Date();
  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error("Tanggal publish tidak valid.");
  }

  return {
    title,
    excerpt,
    category,
    content,
    cover_image: coverImage,
    is_published: isPublished,
    published_at: publishedAt.toISOString(),
  };
}

async function ensureUniqueSlug(supabase, rawSlug, currentId = null) {
  const baseSlug = slugify(rawSlug) || `berita-${Date.now()}`;
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase.from("berita").select("id").eq("slug", candidate);

    if (currentId) {
      query = query.neq("id", currentId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    if (!data) return candidate;

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

async function validateAdmin() {
  const session = await getCurrentSessionContext();

  if (!session.isAuthenticated) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized." }, { status: 401 }),
    };
  }

  if (!session.isAdmin) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Forbidden." }, { status: 403 }),
    };
  }

  return { ok: true, session };
}

export async function GET() {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("berita")
      .select(selectFields)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      items: data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal mengambil daftar berita." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const payload = buildPayload(body);
    const slug = await ensureUniqueSlug(
      supabase,
      cleanString(body.slug) || payload.title
    );

    const { data, error } = await supabase
      .from("berita")
      .insert({
        ...payload,
        slug,
        author_id: auth.session.profile?.id ?? null,
      })
      .select(selectFields)
      .single();

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/berita/${data.slug}`);

    return NextResponse.json(
      {
        message: "Berita berhasil ditambahkan.",
        item: data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal menambahkan berita." },
      { status: 500 }
    );
  }
}