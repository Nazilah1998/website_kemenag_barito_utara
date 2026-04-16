import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeCoverImageUrl } from "@/lib/cover-image";

const BERITA_SELECT_FIELDS = `
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

function normalizeSearchValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTimeValue(value) {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function normalizeBerita(item = {}) {
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

export function getAvailableBeritaCategories(items = []) {
  return [...new Set(items.map((item) => item.category).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "id"),
  );
}

export function filterAndSortBerita(items = [], filters = {}) {
  const q = normalizeSearchValue(filters.q);
  const category = normalizeSearchValue(filters.category);
  const month = String(filters.month || "");
  const sort = String(filters.sort || "newest");

  const filtered = items.filter((item) => {
    const searchableParts = [
      item.title,
      item.excerpt,
      item.category,
      stripHtml(item.content),
    ];

    const matchKeyword =
      !q ||
      searchableParts.some((part) => normalizeSearchValue(part).includes(q));

    const matchCategory =
      !category ||
      category === "all" ||
      normalizeSearchValue(item.category) === category;

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

export async function getAllBerita(options = {}) {
  const { includeDrafts = false } = options;

  noStore();

  const supabase = await createClient();

  let query = supabase
    .from("berita")
    .select(BERITA_SELECT_FIELDS)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (!includeDrafts) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getAllBerita error:", error);
    return [];
  }

  return (data || []).map(normalizeBerita);
}

export async function getLatestBerita(limit = 3) {
  const safeLimit = Math.max(1, Number(limit) || 3);
  const items = await getAllBerita();
  return items.slice(0, safeLimit);
}

export async function getBeritaBySlug(slug, options = {}) {
  const { includeDrafts = false } = options;
  const safeSlug = String(slug || "").trim();

  if (!safeSlug) return null;

  noStore();

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

  if (!data) return null;

  return normalizeBerita(data);
}

function stripHtmlForReading(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingTime(value = "", wordsPerMinute = 200) {
  const plainText = stripHtmlForReading(value);
  const totalWords = plainText
    ? plainText.split(/\s+/).filter(Boolean).length
    : 0;

  if (totalWords === 0) return 1;

  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}

export async function getRelatedBerita(currentSlug, category, limit = 3) {
  const safeLimit = Math.max(1, Number(limit) || 3);
  const items = await getAllBerita();

  const sameCategory = items.filter(
    (item) => item.slug !== currentSlug && item.category === category,
  );

  const fallback = items.filter(
    (item) => item.slug !== currentSlug && item.category !== category,
  );

  return [...sameCategory, ...fallback].slice(0, safeLimit);
}

export async function getAdjacentBerita(slug) {
  const items = await getAllBerita();
  const currentIndex = items.findIndex((item) => item.slug === slug);

  if (currentIndex === -1) {
    return {
      newer: null,
      older: null,
    };
  }

  return {
    newer: items[currentIndex - 1] || null,
    older: items[currentIndex + 1] || null,
  };
}
