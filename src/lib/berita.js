import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeCoverImageUrl } from "@/lib/cover-image";

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
    content: item.content || "",
    isPublished: Boolean(item.is_published),
    createdAt: item.created_at || null,
    updatedAt: item.updated_at || null,
    views: Number(item.views || 0),
  };
}

export async function getAllBerita() {
  noStore();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("berita")
    .select(`
      id,
      slug,
      title,
      excerpt,
      category,
      content,
      cover_image,
      is_published,
      published_at,
      views,
      created_at,
      updated_at
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllBerita error:", error);
    return [];
  }

  return (data || []).map(normalizeBerita);
}

export async function getLatestBerita(limit = 3) {
  const items = await getAllBerita();
  return items.slice(0, limit);
}

export async function getBeritaBySlug(slug) {
  noStore();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("berita")
    .select(`
      id,
      slug,
      title,
      excerpt,
      category,
      content,
      cover_image,
      is_published,
      published_at,
      views,
      created_at,
      updated_at
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("getBeritaBySlug error:", error);
    return null;
  }

  if (!data) return null;

  return normalizeBerita(data);
}