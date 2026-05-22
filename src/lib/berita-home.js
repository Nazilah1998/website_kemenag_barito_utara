import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { normalizeBerita } from "./berita";

const getCachedLatestBeritaHome = unstable_cache(
  async () => {
    try {
      const data = await prisma.berita.findMany({
        where: { is_published: true },
        orderBy: [
          { published_at: 'desc' },
          { created_at: 'desc' }
        ],
        take: 6
      });

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
      const data = await prisma.berita.findMany({
        where: { is_published: true },
        orderBy: [
          { views: 'desc' },
          { published_at: 'desc' }
        ],
        take: 6
      });

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
