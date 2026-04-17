import { describe, it, expect } from "vitest";
import {
  organizationSchema,
  websiteSchema,
  newsArticleSchema,
  breadcrumbSchema,
  contactPageSchema,
} from "@/lib/structured-data";

describe("structured-data", () => {
  it("organizationSchema returns GovernmentOrganization with logo URL", () => {
    const s = organizationSchema();
    expect(s["@type"]).toBe("GovernmentOrganization");
    expect(s.logo.url).toMatch(/^https?:\/\//);
    expect(s.address.addressCountry).toBe("ID");
  });

  it("websiteSchema exposes SearchAction", () => {
    const s = websiteSchema();
    expect(s["@type"]).toBe("WebSite");
    expect(s.potentialAction.target).toContain("/pencarian?q=");
  });

  it("newsArticleSchema returns null for missing berita", () => {
    expect(newsArticleSchema(null)).toBeNull();
  });

  it("newsArticleSchema maps fields correctly", () => {
    const s = newsArticleSchema({
      slug: "uji-coba",
      title: "Judul Uji",
      excerpt: "Ringkasan",
      category: "Umum",
      coverImage: "https://example.com/a.jpg",
      publishedAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-02-01T00:00:00Z",
    });
    expect(s["@type"]).toBe("NewsArticle");
    expect(s.headline).toBe("Judul Uji");
    expect(s.image[0]).toBe("https://example.com/a.jpg");
    expect(s.datePublished).toBe("2026-01-01T00:00:00.000Z");
    expect(s.dateModified).toBe("2026-02-01T00:00:00.000Z");
  });

  it("breadcrumbSchema returns null for empty array", () => {
    expect(breadcrumbSchema([])).toBeNull();
    expect(breadcrumbSchema()).toBeNull();
  });

  it("breadcrumbSchema builds ordered list", () => {
    const s = breadcrumbSchema([
      { name: "Beranda", url: "/" },
      { name: "Berita", url: "/berita" },
    ]);
    expect(s.itemListElement).toHaveLength(2);
    expect(s.itemListElement[0].position).toBe(1);
    expect(s.itemListElement[1].item).toMatch(/\/berita$/);
  });

  it("contactPageSchema has URL and name", () => {
    const s = contactPageSchema();
    expect(s["@type"]).toBe("ContactPage");
    expect(s.url).toMatch(/\/kontak$/);
  });
});
