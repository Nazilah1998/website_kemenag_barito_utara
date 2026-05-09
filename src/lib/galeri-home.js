import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeCoverImageUrl, toCoverPreviewUrl } from "@/lib/cover-image";

const getCachedLatestGaleriHome = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    // 1. Try to get published items first
    let { data, error } = await supabase
      .from("galeri")
      .select(
        "id, title, image_url, link_url, is_published, published_at, created_at",
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error("getCachedLatestGaleriHome (published) error:", error);
    }

    // 2. Fallback: Get any items if no published items found
    if (!data || data.length === 0) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("galeri")
        .select(
          "id, title, image_url, link_url, is_published, published_at, created_at",
        )
        .order("published_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(12);

      if (fallbackError) {
        console.error(
          "getCachedLatestGaleriHome (fallback) error:",
          fallbackError,
        );
      } else {
        data = fallbackData;
      }
    }

    if (!data || data.length === 0) {
      console.warn(
        "getCachedLatestGaleriHome: No gallery data found in database.",
      );
      return [];
    }

    return data.map((item) => {
      const normalizedImage = normalizeCoverImageUrl(item?.image_url || "");
      const previewImage = toCoverPreviewUrl(normalizedImage);

      return {
        id: item?.id ?? null,
        title: item?.title || "Dokumentasi kegiatan",
        imageUrl: previewImage || "/kemenag.svg",
        linkUrl: item?.link_url && item.link_url !== "#" ? item.link_url : "",
        publishedAt: item?.published_at || item?.created_at || null,
      };
    });
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
