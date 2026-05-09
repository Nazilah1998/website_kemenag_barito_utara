import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeCoverImageUrl } from "@/lib/cover-image";

export const BERITA_SELECT_FIELDS = `
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
`;

export function formatDateIndonesia(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function normalizeBerita(item = {}) {
  if (!item) return null;

  const publishedAt = item.published_at || null;
  const createdAt = item.created_at || null;
  const updatedAt = item.updated_at || null;
  const isoDate = publishedAt || createdAt;
  const rawCoverImage = item.cover_image || "";
  const isPublished = Boolean(item.is_published);

  return {
    id: item.id,
    slug: item.slug,
    title: item.title || "",
    excerpt: item.excerpt || "",
    category: item.category || "Umum",
    date: formatDateIndonesia(isoDate),
    isoDate,
    coverImage: normalizeCoverImageUrl(rawCoverImage),
    cover_image: rawCoverImage,
    content: item.content || "",
    isPublished,
    is_published: isPublished,
    publishedAt,
    published_at: publishedAt,
    createdAt,
    created_at: createdAt,
    updatedAt,
    updated_at: updatedAt,
    views: Number(item.views || 0),
  };
}

function normalizeSearchValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTimeValue(value) {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function getAvailableBeritaCategories(items = []) {
  return [...new Set(items.map((item) => item.category).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "id"),
  );
}

export function filterAndSortBerita(items = [], filters = {}) {
  const q = normalizeSearchValue(filters.q);
  const keywords = q ? q.split(/\s+/).filter(Boolean) : [];
  const category = normalizeSearchValue(filters.category);
  const month = String(filters.month || "");
  const sort = String(filters.sort || "newest");

  const filtered = items.filter((item) => {
    // 1. Keyword Match (All keywords must be found somewhere)
    const matchKeyword = keywords.every((kw) => {
      const searchable = [
        item.title,
        item.excerpt,
        item.category,
        stripHtml(item.content),
      ].map(normalizeSearchValue);

      return searchable.some((text) => text.includes(kw));
    });

    // 2. Category Match
    const matchCategory =
      !category ||
      category === "all" ||
      normalizeSearchValue(item.category) === category;

    // 3. Month Match
    const matchMonth =
      !month || String(item.isoDate || "").slice(0, 7) === month;

    return matchKeyword && matchCategory && matchMonth;
  });

  return [...filtered].sort((a, b) => {
    if (sort === "oldest") {
      return getTimeValue(a.isoDate) - getTimeValue(b.isoDate);
    }

    if (sort === "popular") {
      const viewsDiff = Number(b.views || 0) - Number(a.views || 0);
      if (viewsDiff !== 0) return viewsDiff;
      return getTimeValue(b.isoDate) - getTimeValue(a.isoDate);
    }

    return getTimeValue(b.isoDate) - getTimeValue(a.isoDate);
  });
}

/**
 * Mengambil semua berita dengan filter dasar.
 * Tetap disediakan untuk kompatibilitas, tapi sebaiknya gunakan query terarah.
 */
export async function getAllBerita(options = {}) {
  const { includeDrafts = false, limit = null } = options;

  // Hanya gunakan noStore jika benar-benar butuh data real-time terbaru (misal admin)
  if (includeDrafts) noStore();

  const supabase = await createClient();

  let query = supabase
    .from("berita")
    .select(BERITA_SELECT_FIELDS)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (!includeDrafts) {
    query = query.eq("is_published", true);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getAllBerita error:", error);
    return [];
  }

  return (data || []).map(normalizeBerita);
}

/**
 * Optimasi: Langsung limit di database.
 */
export async function getLatestBerita(limit = 3) {
  return getAllBerita({ limit });
}

export async function getBeritaBySlug(slug, options = {}) {
  const { includeDrafts = false } = options;
  const safeSlug = String(slug || "").trim();

  if (!safeSlug) return null;

  if (includeDrafts) noStore();

  const supabase = await createClient();

  let query = supabase
    .from("berita")
    .select(BERITA_SELECT_FIELDS)
    .eq("slug", safeSlug);

  if (!includeDrafts) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("getBeritaBySlug error:", error);
    return null;
  }

  return data ? normalizeBerita(data) : null;
}

export function estimateReadingTime(value = "", wordsPerMinute = 200) {
  const plainText = stripHtml(value);
  const totalWords = plainText
    ? plainText.split(/\s+/).filter(Boolean).length
    : 0;

  if (totalWords === 0) return 1;

  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}

/**
 * Optimasi: Cari berita terkait langsung di database.
 */
export async function getRelatedBerita(currentSlug, category, limit = 3) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("berita")
    .select(BERITA_SELECT_FIELDS)
    .eq("is_published", true)
    .eq("category", category)
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRelatedBerita error:", error);
    return [];
  }

  const results = (data || []).map(normalizeBerita);

  // Jika kurang dari limit, ambil berita terbaru lainnya sebagai fallback
  if (results.length < limit) {
    const { data: fallbackData } = await supabase
      .from("berita")
      .select(BERITA_SELECT_FIELDS)
      .eq("is_published", true)
      .neq("slug", currentSlug)
      .neq("category", category)
      .order("published_at", { ascending: false })
      .limit(limit - results.length);

    if (fallbackData) {
      results.push(...fallbackData.map(normalizeBerita));
    }
  }

  return results;
}

/**
 * Optimasi: Cari berita sebelum dan sesudah berdasarkan tanggal.
 */
export async function getAdjacentBerita(currentBerita) {
  if (!currentBerita?.isoDate) return { newer: null, older: null };

  const supabase = await createClient();
  const date = currentBerita.isoDate;

  // Ambil yang lebih baru (yang dipublish setelah berita ini)
  const { data: newerData } = await supabase
    .from("berita")
    .select("slug, title")
    .eq("is_published", true)
    .gt("published_at", date)
    .order("published_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  // Ambil yang lebih lama (yang dipublish sebelum berita ini)
  const { data: olderData } = await supabase
    .from("berita")
    .select("slug, title")
    .eq("is_published", true)
    .lt("published_at", date)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    newer: newerData || null,
    older: olderData || null,
  };
}
