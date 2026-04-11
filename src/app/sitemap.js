import { siteInfo } from "@/data/site";
import { getAllBerita } from "@/lib/berita";

export default async function sitemap() {
  const beritaList = await getAllBerita();

  const staticRoutes = [
    {
      url: `${siteInfo.siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteInfo.siteUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteInfo.siteUrl}/profil`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteInfo.siteUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteInfo.siteUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const beritaRoutes = beritaList.map((item) => ({
    url: `${siteInfo.siteUrl}/berita/${item.slug}`,
    lastModified:
      item.updatedAt || item.isoDate || item.createdAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...beritaRoutes];
}
