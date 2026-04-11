import { siteInfo } from "@/data/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteInfo.siteUrl}/sitemap.xml`,
  };
}
