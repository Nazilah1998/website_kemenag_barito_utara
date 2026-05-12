import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";
import { normalizeCoverImageUrl } from "@/lib/cover-image";

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
    // 1. Keyword Match
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

export async function getAllBerita(options = {}) {
  const { includeDrafts = false, limit = null } = options;

  if (includeDrafts) noStore();

  try {
    const data = await prisma.berita.findMany({
      where: includeDrafts ? {} : { is_published: true },
      orderBy: [
        { published_at: 'desc' },
        { created_at: 'desc' }
      ],
      take: limit ? Number(limit) : undefined
    });

    return (data || []).map(normalizeBerita);
  } catch (error) {
    console.error("getAllBerita error:", error);
    return [];
  }
}

export async function getLatestBerita(limit = 3) {
  return getAllBerita({ limit });
}

export async function getBeritaBySlug(slug, options = {}) {
  const { includeDrafts = false } = options;
  const safeSlug = String(slug || "").trim();

  if (!safeSlug) return null;
  if (includeDrafts) noStore();

  try {
    const data = await prisma.berita.findFirst({
      where: {
        slug: safeSlug,
        ...(includeDrafts ? {} : { is_published: true })
      }
    });

    return data ? normalizeBerita(data) : null;
  } catch (error) {
    console.error("getBeritaBySlug error:", error);
    return null;
  }
}

export function estimateReadingTime(value = "", wordsPerMinute = 200) {
  const plainText = stripHtml(value);
  const totalWords = plainText
    ? plainText.split(/\s+/).filter(Boolean).length
    : 0;

  if (totalWords === 0) return 1;

  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}

export async function getRelatedBerita(currentSlug, category, limit = 3) {
  try {
    const results = await prisma.berita.findMany({
      where: {
        is_published: true,
        category: category,
        slug: { not: currentSlug }
      },
      orderBy: { published_at: 'desc' },
      take: limit
    });

    const normalized = results.map(normalizeBerita);

    if (normalized.length < limit) {
      const fallback = await prisma.berita.findMany({
        where: {
          is_published: true,
          slug: { not: currentSlug },
          category: { not: category }
        },
        orderBy: { published_at: 'desc' },
        take: limit - normalized.length
      });
      normalized.push(...fallback.map(normalizeBerita));
    }

    return normalized;
  } catch (error) {
    console.error("getRelatedBerita error:", error);
    return [];
  }
}

export async function getAdjacentBerita(currentBerita) {
  if (!currentBerita?.isoDate) return { newer: null, older: null };

  const date = currentBerita.isoDate;

  try {
    const newerData = await prisma.berita.findFirst({
      where: {
        is_published: true,
        published_at: { gt: date }
      },
      select: { slug: true, title: true },
      orderBy: { published_at: 'asc' }
    });

    const olderData = await prisma.berita.findFirst({
      where: {
        is_published: true,
        published_at: { lt: date }
      },
      select: { slug: true, title: true },
      orderBy: { published_at: 'desc' }
    });

    return {
      newer: newerData || null,
      older: olderData || null,
    };
  } catch (error) {
    console.error("getAdjacentBerita error:", error);
    return { newer: null, older: null };
  }
}
