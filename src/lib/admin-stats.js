// Agregasi statistik untuk dashboard admin menggunakan Prisma ORM.

import prisma from "@/lib/prisma";

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

export async function getDashboardStats({ days = 14 } = {}) {
  try {
    const since = daysAgo(days - 1);

    // Ambil data statistik paralel untuk efisiensi
    const [
      beritaList,
      totalSlides,
      totalGallery,
      totalKontak,
      kontakBaru,
      totalReportDocs,
      recentActivity
    ] = await Promise.all([
      // Data Berita
      prisma.berita.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          is_published: true,
          published_at: true,
          views: true,
          created_at: true
        },
        orderBy: { created_at: 'desc' }
      }),
      // Counter lainnya
      prisma.homepage_slides.count(),
      prisma.galeri.count(),
      prisma.kontak_pesan.count(),
      prisma.kontak_pesan.count({ where: { status: 'baru' } }),
      prisma.report_documents.count({ where: { is_published: true } }),
      // Aktivitas Audit Log
      prisma.admin_audit_log.findMany({
        take: 8,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          action: true,
          entity: true,
          summary: true,
          actor_email: true,
          created_at: true
        }
      })
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

    // Top 5 berita berdasarkan views.
    const topBerita = [...beritaList]
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
        totalKontak,
        kontakBaru,
        totalReportDocs,
        totalSlides,
        totalGallery,
      },
      trend,
      topBerita,
      recentActivity,
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
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
