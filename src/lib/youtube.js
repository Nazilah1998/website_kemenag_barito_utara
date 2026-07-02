import { db } from "@/lib/drizzle";
import { youtube_videos } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { logError } from "@/lib/logger";
import { unstable_cache } from "next/cache";

export const getPublicYoutubeVideos = unstable_cache(
  async () => {
    try {
      const videos = await db
        .select()
        .from(youtube_videos)
        .where(eq(youtube_videos.is_published, true))
        .orderBy(asc(youtube_videos.sort_order), desc(youtube_videos.updated_at));

      return videos;
    } catch (err) {
      logError("getPublicYoutubeVideos_error", { error: err?.message });
      return [];
    }
  },
  ["public-youtube-videos"],
  {
    revalidate: 300,
    tags: ["youtube-videos"],
  }
);
