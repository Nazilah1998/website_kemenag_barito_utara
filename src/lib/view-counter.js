const viewBuffer = new Map();
let flushTimer = null;
const FLUSH_INTERVAL = 30_000;

async function flushViews() {
  if (viewBuffer.size === 0) return;

  const batch = new Map(viewBuffer);
  viewBuffer.clear();

  const { default: prisma } = await import("@/lib/prisma");

  for (const [slug, count] of batch) {
    try {
      await prisma.berita.update({
        where: { slug },
        data: { views: { increment: count } },
      });
    } catch (err) {
      console.error(`view-counter flush error for ${slug}:`, err.message);
    }
  }
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
