import { getLatestBerita } from "@/lib/berita";
import { siteInfo } from "@/data/site";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://baritoutara.kemenag.go.id";
  const news = await getLatestBerita(20);

  const escapeXml = (unsafe) => {
    return String(unsafe || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const itemsXml = news
    .map((item) => {
      const itemUrl = `${baseUrl}/berita/${item.slug}`;
      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${itemUrl}</link>
      <guid>${itemUrl}</guid>
      <pubDate>${new Date(item.isoDate || item.publishedAt || Date.now()).toUTCString()}</pubDate>
      <description>${escapeXml(item.excerpt)}</description>
      ${item.category ? `<category>${escapeXml(item.category)}</category>` : ""}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteInfo.name)} - Berita</title>
    <link>${baseUrl}/berita</link>
    <description>${escapeXml(siteInfo.description)}</description>
    <language>id-ID</language>
    <atom:link href="${baseUrl}/berita/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
