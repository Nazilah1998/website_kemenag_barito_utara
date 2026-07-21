import { describe, it, expect } from "vitest";
import {
  organizationSchema,
  websiteSchema,
  newsArticleSchema,
  breadcrumbSchema,
  contactPageSchema,
  navigationSchema,
} from "@/lib/structured-data";

describe("structured-data", () => {
  it("organizationSchema returns GovernmentOrganization with logo URL", () => {
    const s = organizationSchema();
    expect(s["@type"]).toContain("GovernmentOrganization");
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

  // ── Extended tests ──────────────────────────────────────────────────────────

  it("all schemas include @context 'https://schema.org'", () => {
    expect(organizationSchema()["@context"]).toBe("https://schema.org");
    expect(websiteSchema()["@context"]).toBe("https://schema.org");
    expect(contactPageSchema()["@context"]).toBe("https://schema.org");
    expect(breadcrumbSchema([{ name: "Home", url: "/" }])["@context"]).toBe("https://schema.org");
    expect(navigationSchema()["@context"]).toBe("https://schema.org");
    expect(newsArticleSchema({ slug: "t", title: "T" })["@context"]).toBe("https://schema.org");
  });

  it("organizationSchema includes GeoCoordinates for Muara Teweh", () => {
    const s = organizationSchema();
    expect(s.geo["@type"]).toBe("GeoCoordinates");
    expect(s.geo.latitude).toBeDefined();
    expect(s.geo.longitude).toBeDefined();
  });

  it("organizationSchema includes opening hours for weekdays", () => {
    const s = organizationSchema();
    expect(Array.isArray(s.openingHoursSpecification)).toBe(true);
    expect(s.openingHoursSpecification.length).toBeGreaterThan(0);
    const weekday = s.openingHoursSpecification[0];
    expect(weekday["@type"]).toBe("OpeningHoursSpecification");
    expect(weekday.opens).toBeDefined();
    expect(weekday.closes).toBeDefined();
  });

  it("organizationSchema has parent organization (Kemenag RI)", () => {
    const s = organizationSchema();
    expect(s.parentOrganization["@type"]).toBe("GovernmentOrganization");
    expect(s.parentOrganization.url).toContain("kemenag.go.id");
  });

  it("organizationSchema logo dimensions are 512x512", () => {
    const s = organizationSchema();
    expect(s.logo.width).toBe(512);
    expect(s.logo.height).toBe(512);
  });

  it("newsArticleSchema uses canonicalUrl override when provided", () => {
    const s = newsArticleSchema(
      { slug: "uji-coba", title: "Test" },
      { canonicalUrl: "https://custom.domain.com/berita/uji-coba" }
    );
    expect(s.mainEntityOfPage["@id"]).toBe("https://custom.domain.com/berita/uji-coba");
  });

  it("newsArticleSchema falls back to default logo image when coverImage is null", () => {
    const s = newsArticleSchema({ slug: "no-cover", title: "Tanpa Cover", coverImage: null });
    expect(s.image[0]).toMatch(/kemenag-512\.png$/);
  });

  it("newsArticleSchema truncates headline at 110 characters", () => {
    const longTitle = "a".repeat(150);
    const s = newsArticleSchema({ slug: "long", title: longTitle });
    expect(s.headline.length).toBeLessThanOrEqual(110);
  });

  it("newsArticleSchema datePublished is undefined for invalid date", () => {
    const s = newsArticleSchema({ slug: "bad", title: "Bad Date", publishedAt: "not-a-date" });
    expect(s.datePublished).toBeUndefined();
  });

  it("newsArticleSchema author is an Organization", () => {
    const s = newsArticleSchema({ slug: "x", title: "Test" });
    expect(s.author["@type"]).toBe("Organization");
  });

  it("breadcrumbSchema uses full URL for absolute URLs in crumbs", () => {
    const s = breadcrumbSchema([
      { name: "External", url: "https://external.com/page" },
    ]);
    expect(s.itemListElement[0].item).toBe("https://external.com/page");
  });

  it("navigationSchema returns ItemList with SiteNavigationElement entries", () => {
    const s = navigationSchema();
    expect(s["@type"]).toBe("ItemList");
    expect(Array.isArray(s.itemListElement)).toBe(true);
    expect(s.itemListElement.length).toBeGreaterThan(0);
    expect(s.itemListElement[0]["@type"]).toBe("SiteNavigationElement");
    expect(s.itemListElement[0].position).toBe(1);
  });

  it("navigationSchema entries include Berita and Kontak links", () => {
    const s = navigationSchema();
    const names = s.itemListElement.map((e) => e.name);
    expect(names).toContain("Berita Terbaru");
    expect(names).toContain("Kontak Kantor");
  });

  it("websiteSchema inLanguage is 'id-ID'", () => {
    const s = websiteSchema();
    expect(s.inLanguage).toBe("id-ID");
  });

  it("contactPageSchema name contains 'Kontak'", () => {
    const s = contactPageSchema();
    expect(s.name.toLowerCase()).toContain("kontak");
  });
});
