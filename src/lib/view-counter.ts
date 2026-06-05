import { redis, hasRedis } from "./redis";

async function getDbViews(slug: string): Promise<number> {
  try {
    const { db } = await import("@/lib/drizzle");
    const { berita } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const result = await db
      .select({ views: berita.views })
      .from(berita)
      .where(eq(berita.slug, slug))
      .limit(1);

    return Number(result[0]?.views ?? 0);
  } catch {
    return 0;
  }
}

let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 60_000;

async function flushViews(): Promise<void> {
  if (!hasRedis() || !redis) return;

  try {
    const keys = await redis.keys("views:*");
    if (!keys || keys.length === 0) return;

    const { db } = await import("@/lib/drizzle");
    const { berita } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    await Promise.all(
      keys.map(async (key: string) => {
        const slug = key.replace("views:", "");
        const redisVal = await redis.get(key);
        if (redisVal === null || redisVal === undefined) return;

        const views = Number(redisVal);
        if (isNaN(views)) return;

        await db
          .update(berita)
          .set({ views })
          .where(eq(berita.slug, slug))
          .catch((err: Error) => {
            console.error(JSON.stringify({ event: "view_flush_error", slug, error: err.message }));
          });
      }),
    );
  } catch (error) {
    console.error(JSON.stringify({ event: "view_flush_error", error: error?.message }));
  }
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushViews().finally(() => scheduleFlush());
  }, FLUSH_INTERVAL);
}

export async function incrementView(slug: string): Promise<number> {
  if (hasRedis() && redis) {
    try {
      const dbViews = await getDbViews(slug);
      
      const exists = await redis.exists(`views:${slug}`);
      if (!exists) {
        await redis.set(`views:${slug}`, String(dbViews));
      }

      const total = await redis.incr(`views:${slug}`);

      if (typeof total === "number") {
        scheduleFlush();
        return total;
      }
    } catch {
      // Redis gagal, fallback ke DB langsung
    }
  }

  try {
    const { db } = await import("@/lib/drizzle");
    const { berita } = await import("@/db/schema");
    const { eq, sql } = await import("drizzle-orm");

    const result = await db
      .update(berita)
      .set({ views: sql`${berita.views} + 1` })
      .where(eq(berita.slug, slug))
      .returning({ views: berita.views });

    return Number(result[0]?.views ?? 0);
  } catch (error) {
    console.error(JSON.stringify({ event: "view_counter_error", slug, error: error?.message }));
    return 0;
  }
}
