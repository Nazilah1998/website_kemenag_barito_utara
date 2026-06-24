import { unstable_cache } from "next/cache";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, desc, and, inArray, notInArray, sql } from "drizzle-orm";
import { normalizeBerita } from "./berita";
import { logError } from "@/lib/logger";

const getCachedLatestBeritaHome = unstable_cache(
  async () => {
    try {
      const data = await db
        .select()
        .from(berita)
        .where(
          and(
            eq(berita.is_published, true),
            inArray(berita.category, ['Umum', 'Kegiatan'])
          )
        )
        .orderBy(desc(berita.published_at), desc(berita.created_at))
        .limit(6);

      return (data || []).map(normalizeBerita);
    } catch (error) {
      logError("getCachedLatestBeritaHome_error", { error: error?.message });
      return [];
    }
  },
  ["home-latest-berita-umum"],
  {
    revalidate: 300,
    tags: ["home-latest-berita"],
  },
);

const getCachedPopularBeritaHome = unstable_cache(
  async () => {
    try {
      const data = await db
        .select()
        .from(berita)
        .where(eq(berita.is_published, true))
        .orderBy(desc(berita.views), desc(berita.published_at))
        .limit(6);

      return (data || []).map(normalizeBerita);
    } catch (error) {
      logError("getCachedPopularBeritaHome_error", { error: error?.message });
      return [];
    }
  },
  ["home-popular-berita"],
  {
    revalidate: 300,
    tags: ["home-popular-berita"],
  },
);

const getCachedBeritaPerBidangHome = unstable_cache(
  async () => {
    try {
      const data = await db
        .select()
        .from(berita)
        .where(
          and(
            eq(berita.is_published, true),
            notInArray(berita.category, ['Umum', 'Kegiatan'])
          )
        )
        .orderBy(desc(berita.published_at), desc(berita.created_at))
        .limit(60);

      const countsData = await db
        .select({ category: berita.category, count: sql`count(*)::int` })
        .from(berita)
        .where(eq(berita.is_published, true))
        .groupBy(berita.category);
        
      const countsMap = {};
      for (const row of countsData) {
        countsMap[row.category] = row.count;
      }

      const grouped = {};
      for (const item of data) {
        const normalized = normalizeBerita(item);
        if (!grouped[normalized.category]) {
          grouped[normalized.category] = [];
        }
        if (grouped[normalized.category].length < 3) {
          grouped[normalized.category].push(normalized);
        }
      }
      
      return Object.entries(grouped)
        .map(([category, items]) => ({ category, items, totalCount: countsMap[category] || items.length }))
        .sort((a, b) => {
          const getWeight = (cat) => {
            const lower = cat.toLowerCase();
            if (lower.includes("tata usaha") || lower.includes("subbag")) return 1;
            if (lower.includes("madrasah")) return 2;
            if (lower.includes("diniyah") || lower.includes("pontren")) return 3;
            if (lower.includes("bimas islam")) return 4;
            if (lower.includes("bimas kristen")) return 5;
            if (lower.includes("zakat") || lower.includes("wakaf")) return 6;
            if (lower.includes("hindu")) return 7;
            if (lower.includes("urusan agama") || lower.includes("kua")) return 8;
            return 99;
          };
          const weightA = getWeight(a.category);
          const weightB = getWeight(b.category);
          
          if (weightA !== weightB) {
            return weightA - weightB;
          }
          return a.category.localeCompare(b.category);
        });
    } catch (error) {
      logError("getCachedBeritaPerBidangHome_error", { error: error?.message });
      return [];
    }
  },
  ["home-berita-per-bidang"],
  {
    revalidate: 300,
    tags: ["home-latest-berita"],
  },
);

export async function getLatestBeritaHome() {
  return getCachedLatestBeritaHome();
}

export async function getPopularBeritaHome() {
  return getCachedPopularBeritaHome();
}

export async function getBeritaPerBidangHome() {
  return getCachedBeritaPerBidangHome();
}
