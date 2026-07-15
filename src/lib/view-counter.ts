import { redis, hasRedis } from "./redis";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function incrementView(slug: string): Promise<number> {
  try {
    const result = await db
      .update(berita)
      .set({ views: sql`${berita.views} + 1` })
      .where(eq(berita.slug, slug))
      .returning({ views: berita.views });

    return Number(result[0]?.views ?? 0);
  } catch (error: any) {
    console.error(JSON.stringify({ event: "view_counter_error", slug, error: error?.message }));
    return 0;
  }
}


