import { siteInfo, siteLinks } from "@/data/site";

const BASE = siteInfo.siteUrl.replace(/\/$/, "");

/**
 * Bangun schema Organization untuk Kemenag Barito Utara.
 * Ditanam di layout root agar muncul di setiap halaman.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["GovernmentOrganization", "GovernmentOffice"],
    "@id": `${BASE}#organization`,
    name: "Kementerian Agama Kabupaten Barito Utara",
    alternateName: ["Kemenag Barito Utara", "Kemenag Barut"],
    url: `${BASE}/`,
    logo: {
      "@type": "ImageObject",
      url: `${BASE}/kemenag-512.png`,
      width: 512,
      height: 512,
    },
    image: `${BASE}/kantor-kemenag.jpg`,
    description: siteInfo.description,
    email: siteInfo.email,
    telephone: siteInfo.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Ahmad Yani No.126",
      addressLocality: "Muara Teweh",
      addressRegion: "Kalimantan Tengah",
      postalCode: "73811",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-0.9576",
      longitude: "114.8967",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "07:30",
        closes: "16:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "07:30",
        closes: "16:30",
      },
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Kabupaten Barito Utara",
    },
    parentOrganization: {
      "@type": "GovernmentOrganization",
      name: "Kementerian Agama Republik Indonesia",
      url: "https://kemenag.go.id",
    },
    sameAs: [siteLinks.mapDirectionUrl, siteLinks.instagram],
  };
}

/**
 * Bangun schema WebSite dengan sitelinks search box.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}#website`,
    url: `${BASE}/`,
    name: "Kemenag Barito Utara",
    alternateName: [
      "Kementerian Agama Kabupaten Barito Utara",
      "Kemenag Barut",
      "kemenag-baritoutara.com",
    ],
    description: siteInfo.description,
    inLanguage: "id-ID",
    publisher: { "@id": `${BASE}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE}/pencarian?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Bangun schema NewsArticle untuk detail berita.
 */
export function newsArticleSchema(berita, { canonicalUrl } = {}) {
  if (!berita) return null;
  const url = canonicalUrl || `${BASE}/berita/${berita.slug}`;
  const image = berita.coverImage
    ? [String(berita.coverImage)]
    : [`${BASE}${siteInfo.logoSrc}`];
  const datePublished =
    berita.publishedAt || berita.isoDate || berita.createdAt || null;
  const dateModified = berita.updatedAt || datePublished;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: String(berita.title || "").slice(0, 110),
    description: berita.excerpt || siteInfo.description,
    image,
    datePublished: safeIso(datePublished),
    dateModified: safeIso(dateModified),
    articleSection: berita.category || "Umum",
    inLanguage: "id-ID",
    author: {
      "@type": "Organization",
      name: siteInfo.shortName,
      url: `${BASE}/`,
    },
    publisher: {
      "@type": "GovernmentOrganization",
      name: siteInfo.name,
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/kemenag-512.png`,
        width: 512,
        height: 512,
      },
    },
  };
}

/**
 * Bangun schema BreadcrumbList dari daftar crumb {name, url}.
 */
export function breadcrumbSchema(crumbs = []) {
  if (!Array.isArray(crumbs) || crumbs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.url?.startsWith("http") ? crumb.url : `${BASE}${crumb.url}`,
    })),
  };
}

/**
 * Bangun schema ContactPage.
 */
export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${BASE}/kontak`,
    name: `Kontak - ${siteInfo.shortName}`,
    description:
      "Kanal kontak resmi Kementerian Agama Kabupaten Barito Utara: WhatsApp, telepon, email, dan lokasi kantor.",
    isPartOf: { "@id": `${BASE}#website` },
    about: { "@id": `${BASE}#organization` },
  };
}

/**
 * Bangun schema SiteNavigationElement untuk membantu Sitelinks.
 */
export function navigationSchema() {
  const items = [
    { name: "Berita Terbaru", url: "/berita" },
    { name: "Layanan Publik", url: "/layanan" },
    { name: "Galeri Foto", url: "/galeri" },
    { name: "Kontak Kantor", url: "/kontak" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, idx) => ({
      "@type": "SiteNavigationElement",
      position: idx + 1,
      name: item.name,
      url: `${BASE}${item.url}`,
    })),
  };
}

function safeIso(value) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}
