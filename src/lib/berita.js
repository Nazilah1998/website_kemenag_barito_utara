import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, and, ne, desc, asc, gt, lt, sql, ilike, or } from "drizzle-orm";
import { toCoverPreviewUrl } from "@/lib/cover-image";
import { logWarn, logError } from "@/lib/logger";
import { formatDate } from "@/lib/date-utils";
import { BERITA_CATEGORIES } from "@/lib/berita-utils";

export function normalizeBerita(item = {}) {
  if (!item) return null;

  const publishedAt = item.published_at || null;
  const createdAt = item.created_at || null;
  const updatedAt = item.updated_at || null;
  const isoDate = publishedAt || createdAt;
  const rawCoverImage = item.cover_image || "";

  // Debug: log jika cover_image kosong pada berita yg sudah dipublikasi
  if (!rawCoverImage && item.is_published && item.slug) {
    logWarn("normalizeBerita_cover_image_empty", {
      slug: item.slug,
      title: item.title?.slice(0, 50),
      id: item.id,
    });
  }

  const isPublished = Boolean(item.is_published);

  return {
    id: item.id,
    slug: item.slug,
    title: item.title || "",
    excerpt: item.excerpt || "",
    category: item.category || "Umum",
    date: formatDate(isoDate),
    isoDate,
    coverImage: toCoverPreviewUrl(rawCoverImage),
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
    author: item.profiles?.full_name || item.author || "Admin Kemenag",
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
    (a, b) => {
      const indexA = BERITA_CATEGORIES.indexOf(a);
      const indexB = BERITA_CATEGORIES.indexOf(b);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return a.localeCompare(b, "id");
    }
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
    let query = db
      .select()
      .from(berita)
      .orderBy(desc(berita.published_at), desc(berita.created_at));

    if (!includeDrafts) {
      query = query.where(eq(berita.is_published, true));
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const data = await query;

    return (data || []).map(normalizeBerita);
  } catch (error) {
    logError("getAllBerita_error", { error: error?.message });
    return [];
  }
}

export async function getAvailableBeritaMonthsDB() {
  noStore();
  try {
    const result = await db
      .select({ monthKey: sql`to_char(${berita.published_at}, 'YYYY-MM')` })
      .from(berita)
      .where(eq(berita.is_published, true))
      .groupBy(sql`to_char(${berita.published_at}, 'YYYY-MM')`)
      .orderBy(desc(sql`to_char(${berita.published_at}, 'YYYY-MM')`));

    const formatter = new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    });

    return result
      .filter((row) => row.monthKey)
      .map((row) => {
        const monthValue = String(row.monthKey);
        const date = new Date(`${monthValue}-01T00:00:00`);
        const formatted = formatter.format(date);
        const label = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        return { value: monthValue, label };
      });
  } catch (error) {
    logError("getAvailableBeritaMonthsDB_error", { error: error?.message });
    return [];
  }
}

export async function getBeritaPaginated(options = {}) {
  const {
    q = "",
    category = "",
    month = "",
    sort = "newest",
    page = 1,
    limit = 12,
    includeDrafts = false,
  } = options;

  if (includeDrafts) noStore();

  try {
    const conditions = [];

    if (!includeDrafts) {
      conditions.push(eq(berita.is_published, true));
    }

    if (category && category !== "all") {
      conditions.push(eq(berita.category, category));
    }

    if (month && month !== "all") {
      conditions.push(eq(sql`to_char(${berita.published_at}, 'YYYY-MM')`, month));
    }

    if (q) {
      const tsQuery = q.trim();
      conditions.push(
        sql`to_tsvector('simple', coalesce(${berita.title}, '') || ' ' || coalesce(${berita.excerpt}, '') || ' ' || coalesce(${berita.category}, '') || ' ' || coalesce(${berita.content}, '')) @@ plainto_tsquery('simple', ${tsQuery})`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause;
    if (sort === "oldest") {
      orderByClause = [asc(berita.published_at), asc(berita.created_at)];
    } else if (sort === "popular") {
      orderByClause = [
        desc(berita.views),
        desc(berita.published_at),
        desc(berita.created_at),
      ];
    } else {
      // newest
      orderByClause = [desc(berita.published_at), desc(berita.created_at)];
    }

    const [{ total }] = await db
      .select({ total: sql`count(*)` })
      .from(berita)
      .where(whereClause);

    const data = await db
      .select()
      .from(berita)
      .where(whereClause)
      .orderBy(...orderByClause)
      .limit(Number(limit))
      .offset(options.offset !== undefined ? Number(options.offset) : (Number(page) - 1) * Number(limit));

    return {
      data: (data || []).map(normalizeBerita),
      total: Number(total || 0),
    };
  } catch (error) {
    logError("getBeritaPaginated_error", { error: error?.message });
    return { data: [], total: 0 };
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
    const conditions = [eq(berita.slug, safeSlug)];
    if (!includeDrafts) {
      conditions.push(eq(berita.is_published, true));
    }

    const [data] = await db
      .select()
      .from(berita)
      .where(and(...conditions))
      .limit(1);

    return data ? normalizeBerita(data) : null;
  } catch (error) {
    logError("getBeritaBySlug_error", { error: error?.message });
    return null;
  }
}

export async function getRelatedBerita(currentSlug, category, limit = 3) {
  try {
    const results = await db
      .select()
      .from(berita)
      .where(
        and(
          eq(berita.is_published, true),
          eq(berita.category, category),
          ne(berita.slug, currentSlug),
        ),
      )
      .orderBy(desc(berita.published_at))
      .limit(limit);

    const normalized = results.map(normalizeBerita);

    if (normalized.length < limit) {
      const fallback = await db
        .select()
        .from(berita)
        .where(
          and(
            eq(berita.is_published, true),
            ne(berita.slug, currentSlug),
            ne(berita.category, category),
          ),
        )
        .orderBy(desc(berita.published_at))
        .limit(limit - normalized.length);
      normalized.push(...fallback.map(normalizeBerita));
    }

    return normalized;
  } catch (error) {
    logError("getRelatedBerita_error", { error: error?.message });
    return [];
  }
}

export async function getAdjacentBerita(currentBerita) {
  if (!currentBerita?.isoDate) return { newer: null, older: null };

  const date = currentBerita.isoDate;

  try {
    const [newerData] = await db
      .select({ slug: berita.slug, title: berita.title, coverImage: berita.cover_image, isoDate: berita.published_at, category: berita.category })
      .from(berita)
      .where(and(eq(berita.is_published, true), gt(berita.published_at, date)))
      .orderBy(asc(berita.published_at))
      .limit(1);

    const [olderData] = await db
      .select({ slug: berita.slug, title: berita.title, coverImage: berita.cover_image, isoDate: berita.published_at, category: berita.category })
      .from(berita)
      .where(and(eq(berita.is_published, true), lt(berita.published_at, date)))
      .orderBy(desc(berita.published_at))
      .limit(1);

    return {
      newer: newerData || null,
      older: olderData || null,
    };
  } catch (error) {
    logError("getAdjacentBerita_error", { error: error?.message });
    return { newer: null, older: null };
  }
}
