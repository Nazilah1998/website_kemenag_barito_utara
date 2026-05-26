import { siteInfo } from "@/data/site";
import { laporanCategories } from "@/data/laporan";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const revalidate = 300;

const ZI_SLUGS = [
  "area-perubahan-zi",
  "video-pembangunan-zi",
  "berita-zona-integritas",
];

export default async function sitemap() {
  const base = siteInfo.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1.0 },
    { path: "/berita", priority: 0.9 },
    { path: "/profil/sejarah", priority: 0.8 },
    { path: "/profil/visi-misi", priority: 0.8 },
    { path: "/profil/tugas-fungsi", priority: 0.8 },
    { path: "/profil/tujuan", priority: 0.8 },
    { path: "/profil/nilai-budaya-kerja", priority: 0.8 },
    { path: "/layanan", priority: 0.8 },
    { path: "/layanan/ptsp", priority: 0.7 },
    { path: "/galeri", priority: 0.7 },
    { path: "/kontak", priority: 0.7 },
    { path: "/informasi", priority: 0.7 },
    { path: "/informasi/struktur-organisasi", priority: 0.6 },
    { path: "/informasi/profil-pejabat", priority: 0.6 },
    { path: "/survey", priority: 0.6 },
    { path: "/ppid", priority: 0.7 },
    { path: "/laporan", priority: 0.7 },
    { path: "/zona-integritas", priority: 0.6 },
    { path: "/error", priority: 0.3 },
    { path: "/pencarian", priority: 0.3 },
  ].map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.priority >= 0.8 ? "weekly" : route.priority >= 0.6 ? "monthly" : "yearly",
    priority: route.priority,
  }));

  const laporanRoutes = laporanCategories.map((cat) => ({
    url: `${base}/laporan/${cat.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const zonaRoutes = ZI_SLUGS.map((slug) => ({
    url: `${base}/zona-integritas/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  let beritaRoutes = [];

  try {
    const beritaList = await db
      .select({
        slug: berita.slug,
        updated_at: berita.updated_at,
        published_at: berita.published_at,
        created_at: berita.created_at,
      })
      .from(berita)
      .where(eq(berita.is_published, true))
      .orderBy(desc(berita.published_at));

    beritaRoutes = (beritaList || []).map((item) => ({
      url: `${base}/berita/${item.slug}`,
      lastModified: safeDate(
        item.updated_at || item.published_at || item.created_at,
      ),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("[sitemap] berita fetch error:", err?.message || err);
  }

  return [...staticRoutes, ...laporanRoutes, ...zonaRoutes, ...beritaRoutes];
}

function safeDate(value) {
  if (!value) return new Date();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}
