import { siteInfo } from "@/data/site";

/**
 * Robots.txt dinamis Next.js (app/robots.js).
 * Melindungi admin, api internal, dan halaman autentikasi dari crawler.
 */
export default function robots() {
  const base = siteInfo.siteUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/auth/",
          "/login",
          "/debug-error",
          "/pencarian?",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
