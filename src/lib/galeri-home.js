import { unstable_cache } from "next/cache";
import { db } from "@/lib/drizzle";
import { galeri } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { normalizeCoverImageUrl, toCoverPreviewUrl } from "@/lib/cover-image";

const getCachedLatestGaleriHome = unstable_cache(
  async () => {
    try {
      // 1. Try to get published items first
      let data = await db
        .select()
        .from(galeri)
        .where(eq(galeri.is_published, true))
        .orderBy(desc(galeri.published_at), desc(galeri.created_at))
        .limit(12);

      // 2. Fallback: Get any items if no published items found
      if (!data || data.length === 0) {
        data = await db
          .select()
          .from(galeri)
          .orderBy(desc(galeri.published_at), desc(galeri.created_at))
          .limit(12);
      }

      if (!data || data.length === 0) {
        console.warn("getCachedLatestGaleriHome: No gallery data found in database.");
        return [];
      }

      return data.map((item) => {
        const normalizedImage = normalizeCoverImageUrl(item?.image_url || "");
        const previewImage = toCoverPreviewUrl(normalizedImage);

        return {
          id: item?.id ?? null,
          title: item?.title || "Dokumentasi kegiatan",
          imageUrl: previewImage || "/assets/branding/kemenag.svg",
          linkUrl: item?.link_url && item.link_url !== "#" ? item.link_url : "",
          publishedAt: item?.published_at || item?.created_at || null,
        };
      });
    } catch (error) {
      console.error("getCachedLatestGaleriHome error:", error);
      return [];
    }
  },
  ["home-latest-galeri-v2"],
  {
    revalidate: 300,
    tags: ["home-latest-galeri-v2"],
  },
);

export async function getLatestGaleriHome() {
  return getCachedLatestGaleriHome();
}
