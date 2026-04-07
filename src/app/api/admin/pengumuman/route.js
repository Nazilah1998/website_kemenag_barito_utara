import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";
export const dynamic = "force-dynamic";
const table = "pengumuman";
const selectFields = ` id, slug, title, excerpt, content, category, is_important, is_published, published_at, author_id, created_at, updated_at `;
function buildPayload(body) {
  const title = cleanString(body.title);
  const excerpt = cleanString(body.excerpt);
  const content = cleanString(body.content);
  const category = cleanString(body.category) || "Informasi";
  const isImportant = Boolean(body.is_important);
  const isPublished = Boolean(body.is_published);
  const publishedAtInput = cleanString(body.published_at);
  if (!title) {
    throw new Error("Judul pengumuman wajib diisi.");
  }
  if (!excerpt) {
    throw new Error("Ringkasan pengumuman wajib diisi.");
  }
  if (!content) {
    throw new Error("Isi pengumuman wajib diisi.");
  }
  const publishedAt = publishedAtInput
    ? new Date(publishedAtInput)
    : new Date();
  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error("Tanggal publish pengumuman tidak valid.");
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
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal mengambil daftar pengumuman." },
      { status: 500 },
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
      .insert({ ...payload, slug, author_id: auth.session.profile?.id ?? null })
      .select(selectFields)
      .single();
    if (error) {
      throw error;
    }
    return NextResponse.json(
      { message: "Pengumuman berhasil ditambahkan.", item: data },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal menambahkan pengumuman." },
      { status: 500 },
    );
  }
}
