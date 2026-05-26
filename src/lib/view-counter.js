const viewBuffer = new Map();
let flushTimer = null;
const FLUSH_INTERVAL = 30_000;

async function flushViews() {
  if (viewBuffer.size === 0) return;

  const batch = new Map(viewBuffer);
  viewBuffer.clear();

  const { db } = await import("@/lib/drizzle");
  const { berita } = await import("@/db/schema");
  const { eq, sql } = await import("drizzle-orm");

  await Promise.all(
    Array.from(batch.entries()).map(([slug, count]) =>
      db
        .update(berita)
        .set({ views: sql`${berita.views} + ${count}` })
        .where(eq(berita.slug, slug))
        .catch((err) => {
          console.error(`view-counter flush error for ${slug}:`, err.message);
        }),
    ),
  );
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushViews();
  }, FLUSH_INTERVAL);
}

export function incrementView(slug) {
  const current = viewBuffer.get(slug) || 0;
  viewBuffer.set(slug, current + 1);
  scheduleFlush();
  return viewBuffer.get(slug);
}
