import { unstable_cache } from "next/cache";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { normalizeBerita } from "./berita";

const getCachedLatestBeritaHome = unstable_cache(
  async () => {
    try {
      const data = await db
        .select()
        .from(berita)
        .where(eq(berita.is_published, true))
        .orderBy(desc(berita.published_at), desc(berita.created_at))
        .limit(6);

      return (data || []).map(normalizeBerita);
    } catch (error) {
      console.error("getCachedLatestBeritaHome error:", error);
      return [];
    }
  },
  ["home-latest-berita"],
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
      console.error("getCachedPopularBeritaHome error:", error);
      return [];
    }
  },
  ["home-popular-berita"],
  {
    revalidate: 300,
    tags: ["home-popular-berita"],
  },
);

export async function getLatestBeritaHome() {
  return getCachedLatestBeritaHome();
}

export async function getPopularBeritaHome() {
  return getCachedPopularBeritaHome();
}
