const viewBuffer = new Map<string, number>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 30_000;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function useUpstash(): boolean {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}

async function upstashCommand(args: unknown[]): Promise<unknown | null> {
  try {
    const response = await fetch(UPSTASH_URL as string, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.result ?? null;
  } catch {
    return null;
  }
}

async function flushViews(): Promise<void> {
  if (viewBuffer.size === 0) return;

  const batch = new Map(viewBuffer);
  viewBuffer.clear();

  if (useUpstash()) {
    await Promise.all(
      Array.from(batch.keys()).map(async (slug) => {
        const redisVal = await upstashCommand(["GETSET", `view:${slug}`, "0"]);
        if (redisVal !== null) {
          batch.set(slug, Number(redisVal));
        }
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db: any = (await import("@/lib/drizzle")).db;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const berita: any = (await import("@/db/schema")).berita;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { eq, sql }: { eq: any; sql: any } = await import("drizzle-orm");

  await Promise.all(
    Array.from(batch.entries()).map(([slug, count]) =>
      db
        .update(berita)
        .set({ views: sql`${berita.views} + ${count}` })
        .where(eq(berita.slug, slug))
        .catch((err: Error) => {
          console.error(JSON.stringify({ event: "view_counter_flush_error", slug, error: err.message }));
        }),
    ),
  );
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushViews();
  }, FLUSH_INTERVAL);
}

export function incrementView(slug: string): number {
  const current = viewBuffer.get(slug) || 0;
  viewBuffer.set(slug, current + 1);

  if (useUpstash()) {
    upstashCommand(["INCR", `view:${slug}`])
      .then((count) => {
        if (count === 1) {
          upstashCommand(["EXPIRE", `view:${slug}`, "120"]);
        }
      })
      .catch(() => {});
  }

  scheduleFlush();
  return viewBuffer.get(slug) as number;
}
