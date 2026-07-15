import { db } from "@/lib/drizzle";
import { berita, homepage_slides, galeri, report_documents, youtube_videos } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { logError } from "@/lib/logger";

function safeDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysAgo(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export async function getDashboardStats({
  days = 14,
  isSuperAdmin = false,
} = {}) {
  try {
    const since = daysAgo(days - 1);

    // Ambil data statistik paralel untuk efisiensi
    const [
      beritaList,
      [{ count: totalSlides }],
      [{ count: totalGallery }],
      [{ count: totalReportDocs }],
      [{ count: totalYoutubeVideos }],
      recentActivity,
    ] = await Promise.all([
      // Data Berita
      db.select({
        id: berita.id,
        title: berita.title,
        slug: berita.slug,
        is_published: berita.is_published,
        published_at: berita.published_at,
        views: berita.views,
        created_at: berita.created_at,
      })
      .from(berita)
      .orderBy(desc(berita.created_at)),
      
      // Counter lainnya
      db.select({ count: sql`count(*)` }).from(homepage_slides),
      db.select({ count: sql`count(*)` }).from(galeri),
      db.select({ count: sql`count(*)` }).from(report_documents).where(eq(report_documents.is_published, true)),
      db.select({ count: sql`count(*)` }).from(youtube_videos),
      Promise.resolve([]),
    ]);

    const totalBerita = beritaList.length;
    const totalPublished = beritaList.filter((b) => b.is_published).length;
    const totalDraft = totalBerita - totalPublished;
    const totalViews = beritaList.reduce(
      (sum, b) => sum + Number(b.views || 0),
      0,
    );
    const recent7 = beritaList.filter((b) => {
      const d = safeDate(b.created_at);
      return d && d >= daysAgo(7);
    }).length;

    // Trend: jumlah berita terbit per hari dalam `days` hari terakhir.
    const bucket = new Map();
    for (let i = 0; i < days; i += 1) {
      const d = daysAgo(days - 1 - i);
      const key = d.toISOString().slice(0, 10);
      bucket.set(key, 0);
    }
    for (const b of beritaList) {
      const d = safeDate(b.published_at);
      if (!d) continue;
      if (d < since) continue;
      const key = startOfDay(d).toISOString().slice(0, 10);
      if (bucket.has(key)) bucket.set(key, bucket.get(key) + 1);
    }
    const trend = Array.from(bucket.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    // Top 5 berita berdasarkan views, mengikuti rentang `days` (konsisten dengan trend/recent7).
    const beritaPublishedInRange = beritaList.filter((b) => {
      const d = safeDate(b.published_at);
      return d && d >= since;
    });

    const topBerita = [...beritaPublishedInRange]
      .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        views: Number(b.views || 0),
        is_published: !!b.is_published,
      }));

    return {
      ok: true,
      summary: {
        totalBerita,
        totalPublished,
        totalDraft,
        totalViews,
        recent7,
        totalReportDocs,
        totalSlides,
        totalGallery,
        totalYoutubeVideos,
      },
      trend,
      topBerita,
      recentActivity,
    };
  } catch (error) {
    logError("dashboard_stats_error", { error: error?.message });
    return {
      ok: false,
      error: error.message,
      summary: null,
      trend: [],
      topBerita: [],
      recentActivity: [],
    };
  }
}
