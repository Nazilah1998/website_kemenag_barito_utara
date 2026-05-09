// Agregasi statistik untuk dashboard admin.

import { createAdminClient } from "@/lib/supabase/admin";

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
  const supabase = createAdminClient();
  const since = daysAgo(days - 1);

  // Ambil semua berita ringkas.
  const { data: berita, error: beritaErr } = await supabase
    .from("berita")
    .select("id, title, slug, is_published, published_at, views, created_at")
    .order("created_at", { ascending: false });

  if (beritaErr) {
    return {
      ok: false,
      error: beritaErr.message,
      summary: null,
      trend: [],
      topBerita: [],
      recentActivity: [],
    };
  }

  const beritaList = berita || [];
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

  // Hitung agenda & pengumuman (jika tabel tersedia).
  let totalKontak = 0;
  let kontakBaru = 0;
  let totalReportDocs = 0;
  let totalSlides = 0;
  let totalGallery = 0;

  try {
    const { count: slideCount } = await supabase
      .from("homepage_slides")
      .select("id", { count: "exact", head: true });
    totalSlides = slideCount || 0;

    const { count: galleryCount } = await supabase
      .from("galeri")
      .select("id", { count: "exact", head: true });
    totalGallery = galleryCount || 0;

    const { count } = await supabase
      .from("kontak_pesan")
      .select("id", { count: "exact", head: true });
    totalKontak = count || 0;

    const baru = await supabase
      .from("kontak_pesan")
      .select("id", { count: "exact", head: true })
      .eq("status", "baru");
    kontakBaru = baru.count || 0;

    const docs = await supabase
      .from("report_documents")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true);
    totalReportDocs = docs.count || 0;
  } catch {
    // abaikan
  }

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

  // Aktivitas terbaru dari audit log (jika ada).
  let recentActivity = [];
  try {
    const { data } = await supabase
      .from("admin_audit_log")
      .select("id, action, entity, summary, actor_email, created_at")
      .order("created_at", { ascending: false })
      .limit(8);
    recentActivity = data || [];
  } catch {
    recentActivity = [];
  }

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
}
