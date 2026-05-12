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
        take: 12
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

export async function getLatestBeritaHome() {
  return getCachedLatestBeritaHome();
}
