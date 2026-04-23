import { siteInfo } from "@/data/site";
import { laporanCategories } from "@/data/laporan";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 300;

export default async function sitemap() {
  const base = siteInfo.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/berita", changeFrequency: "daily", priority: 0.9 },
    { path: "/profil", changeFrequency: "monthly", priority: 0.8 },
    { path: "/profil/sejarah", changeFrequency: "yearly", priority: 0.5 },
    { path: "/profil/visi-misi", changeFrequency: "yearly", priority: 0.5 },
    {
      path: "/profil/tugas-dan-fungsi",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    { path: "/profil/struktur", changeFrequency: "monthly", priority: 0.6 },
    { path: "/layanan", changeFrequency: "weekly", priority: 0.8 },
    { path: "/galeri", changeFrequency: "weekly", priority: 0.7 },
    { path: "/kontak", changeFrequency: "monthly", priority: 0.7 },
    { path: "/informasi", changeFrequency: "weekly", priority: 0.7 },
    { path: "/survey", changeFrequency: "monthly", priority: 0.6 },
    { path: "/ppid", changeFrequency: "monthly", priority: 0.7 },
    { path: "/laporan", changeFrequency: "monthly", priority: 0.7 },
    { path: "/zona-integritas", changeFrequency: "monthly", priority: 0.6 },
    {
      path: "/zona-integritas/komitmen",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      path: "/zona-integritas/program",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      path: "/zona-integritas/pencapaian",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    { path: "/pencarian", changeFrequency: "monthly", priority: 0.3 },
  ].map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const laporanRoutes = laporanCategories.map((cat) => ({
    url: `${base}/laporan/${cat.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  let beritaRoutes = [];

  try {
    const supabase = createAdminClient();

    const { data: beritaList, error: beritaError } = await supabase
      .from("berita")
      .select("slug, updated_at, published_at, created_at, status")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (beritaError) {
      console.error("[sitemap] berita fetch error:", beritaError.message);
    } else {
      beritaRoutes = (beritaList || []).map((item) => ({
        url: `${base}/berita/${item.slug}`,
        lastModified: safeDate(
          item.updated_at || item.published_at || item.created_at,
        ),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("[sitemap] general fetch error:", err?.message || err);
  }

  return [...staticRoutes, ...laporanRoutes, ...beritaRoutes];
}

function safeDate(value) {
  if (!value) return new Date();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}
