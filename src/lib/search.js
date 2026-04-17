import { beritaItems } from "../data/berita";
import { publicDocuments } from "../data/documents";
import {
  serviceHighlights,
  serviceCategories,
  serviceRequirements,
  serviceFlow,
  serviceFaqs,
} from "../data/services";
import {
  profileOverview,
  visionMission,
  leadershipProfiles,
} from "../data/profile";
import { galleryList } from "../data/gallery";

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toSearchText(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === "string") return item;
        if (item == null) return [];
        if (typeof item === "object") {
          return Object.values(item).filter(
            (entry) => typeof entry === "string" || typeof entry === "number",
          );
        }
        return String(item);
      })
      .join(" ");
  }

  if (value == null) return "";

  if (typeof value === "object") {
    return Object.values(value)
      .filter((entry) => typeof entry === "string" || typeof entry === "number")
      .join(" ");
  }

  return String(value);
}

function buildKeywords(...parts) {
  return parts
    .map((part) => toSearchText(part))
    .filter(Boolean)
    .join(" ");
}

function safeHref(value, fallback = "/") {
  const href = String(value || "").trim();
  return href || fallback;
}

const searchIndex = [
  ...beritaItems.map((item) => ({
    id: `berita-${item.slug}`,
    title: item.title,
    description: item.excerpt,
    section: "Berita",
    category: item.category,
    href: `/berita/${item.slug}`,
    keywords: buildKeywords(
      item.title,
      item.excerpt,
      item.category,
      item.content,
    ),
  })),

  ...publicDocuments.map((item, index) => ({
    id: `dokumen-${index}`,
    title: item.title,
    description: item.description,
    section: "Dokumen",
    category: item.category,
    href:
      item.isAvailable && item.href
        ? safeHref(item.href, "/informasi")
        : "/informasi",
    keywords: buildKeywords(
      item.title,
      item.description,
      item.category,
      item.fileLabel,
    ),
  })),

  ...serviceHighlights.map((item, index) => ({
    id: `layanan-highlight-${index}`,
    title: item.title,
    description: item.description,
    section: "Layanan",
    category: item.category,
    href: safeHref(item.href, "/layanan"),
    keywords: buildKeywords(item.title, item.description, item.category),
  })),

  ...serviceCategories.map((item, index) => ({
    id: `layanan-kategori-${index}`,
    title: item.title,
    description: item.description,
    section: "Layanan",
    category: "Kategori",
    href: "/layanan",
    keywords: buildKeywords(item.title, item.description, item.items),
  })),

  ...serviceRequirements.map((item, index) => ({
    id: `layanan-syarat-${index}`,
    title: item.title,
    description: toSearchText(item.items).split(",").join(" • "),
    section: "Layanan",
    category: "Persyaratan",
    href: "/layanan",
    keywords: buildKeywords(item.title, item.items),
  })),

  ...serviceFlow.map((item) => ({
    id: `layanan-alur-${item.step}`,
    title: `${item.step} - ${item.title}`,
    description: item.description,
    section: "Layanan",
    category: "Alur",
    href: "/layanan",
    keywords: buildKeywords(item.step, item.title, item.description),
  })),

  ...serviceFaqs.map((item, index) => ({
    id: `layanan-faq-${index}`,
    title: item.question,
    description: item.answer,
    section: "Layanan",
    category: "FAQ",
    href: "/layanan",
    keywords: buildKeywords(item.question, item.answer),
  })),

  {
    id: "profil-overview",
    title: profileOverview.title,
    description: profileOverview.description,
    section: "Profil",
    category: "Instansi",
    href: "/profil",
    keywords: buildKeywords(
      profileOverview.title,
      profileOverview.description,
      (profileOverview.highlights || []).map(
        (item) => `${item.title} ${item.description}`,
      ),
    ),
  },

  {
    id: "profil-visi-misi",
    title: "Visi & Misi",
    description: visionMission.vision,
    section: "Profil",
    category: "Visi & Misi",
    href: "/profil/visi-misi",
    keywords: buildKeywords(
      visionMission.vision,
      visionMission.missions,
      visionMission.values,
    ),
  },

  ...leadershipProfiles.map((item, index) => ({
    id: `profil-pimpinan-${index}`,
    title: item.name,
    description: `${item.position} • ${item.description}`,
    section: "Profil",
    category: "Pimpinan",
    href: "/informasi/profil-pejabat",
    keywords: buildKeywords(item.name, item.position, item.description),
  })),

  ...galleryList.map((item) => ({
    id: `galeri-${item.slug}`,
    title: item.title,
    description: item.subtitle,
    section: "Galeri",
    category: item.category,
    href: "/galeri",
    keywords: buildKeywords(item.title, item.subtitle, item.category),
  })),
];

export function searchSite(rawQuery = "") {
  const query = normalizeText(rawQuery);

  if (!query) return [];

  const terms = query.split(" ").filter(Boolean);

  return searchIndex
    .map((item) => {
      const normalizedTitle = normalizeText(item.title);
      const normalizedCategory = normalizeText(item.category);
      const haystack = normalizeText(
        [
          item.title,
          item.description,
          item.section,
          item.category,
          item.keywords,
        ].join(" "),
      );

      let score = 0;

      for (const term of terms) {
        if (normalizedTitle.includes(term)) score += 5;
        if (normalizedCategory.includes(term)) score += 3;
        if (haystack.includes(term)) score += 2;
      }

      return {
        ...item,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
