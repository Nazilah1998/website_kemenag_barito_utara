import { createClient } from "@supabase/supabase-js";

/**
 * Helper untuk mengambil data halaman statis.
 * Menggunakan publishable key karena pembacaan tidak memerlukan service role.
 */
function createReadClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const selectFields = `
  id, slug, title, description, content, is_published, updated_at, created_at
`;

export async function getStaticPageBySlug(slug) {
  const supabase = createReadClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("static_pages")
    .select(selectFields)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[static-pages] getBySlug error:", error.message);
    return null;
  }

  return data;
}

export async function listPublishedStaticPages({ limit = 50 } = {}) {
  const supabase = createReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("static_pages")
    .select("id, slug, title, description, updated_at")
    .eq("is_published", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[static-pages] listPublished error:", error.message);
    return [];
  }

  return data || [];
}

export async function listAllStaticPages({ limit = 100 } = {}) {
  const supabase = createReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("static_pages")
    .select("id, slug, title, description, is_published, updated_at")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[static-pages] listAll error:", error.message);
    return [];
  }

  return data || [];
}
