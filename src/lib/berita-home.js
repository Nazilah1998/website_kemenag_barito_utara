import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { env } from "@/lib/env";
import { normalizeCoverImageUrl } from "@/lib/cover-image";

const supabase = createClient(env.supabaseUrl, env.supabasePublishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

function formatDateIndonesia(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeBerita(item) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || "",
    category: item.category || "Umum",
    date: formatDateIndonesia(item.published_at || item.created_at),
    isoDate: item.published_at || item.created_at,
    coverImage: normalizeCoverImageUrl(item.cover_image || ""),
  };
}

const getCachedLatestBeritaHome = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from("berita")
      .select(
        `
          id,
          slug,
          title,
          excerpt,
          category,
          cover_image,
          published_at,
          created_at
        `,
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("getCachedLatestBeritaHome error:", error);
      return [];
    }

    return (data || []).map(normalizeBerita);
  },
  ["home-latest-berita"],
  {
    revalidate: 300,
    tags: ["home-latest-berita"],
  },
);

export async function getLatestBeritaHome() {
  return getCachedLatestBeritaHome();
}
