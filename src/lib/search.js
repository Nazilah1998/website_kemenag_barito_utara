import { beritaList } from "../data/berita";
import { publicDocuments } from "../data/documents";
import { agendaList } from "../data/agenda";
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

const searchIndex = [
  ...beritaList.map((item) => ({
    id: `berita-${item.slug}`,
    title: item.title,
    description: item.excerpt,
    section: "Berita",
    category: item.category,
    href: `/berita/${item.slug}`,
    keywords: [item.title, item.excerpt, item.category, ...(item.content || [])].join(" "),
  })),

  ...publicDocuments.map((item, index) => ({
    id: `dokumen-${index}`,
    title: item.title,
    description: item.description,
    section: "Dokumen",
    category: item.category,
    href: item.isAvailable ? item.href : "/dokumen",
    keywords: [item.title, item.description, item.category, item.fileLabel].join(" "),
  })),

  ...agendaList.map((item) => ({
    id: `agenda-${item.slug}`,
    title: item.title,
    description: `${item.description} • ${item.date} • ${item.location}`,
    section: "Agenda",
    category: item.category,
    href: "/agenda",
    keywords: [
      item.title,
      item.description,
      item.date,
      item.time,
      item.location,
      item.status,
      item.category,
    ].join(" "),
  })),

  ...serviceHighlights.map((item, index) => ({
    id: `layanan-highlight-${index}`,
    title: item.title,
    description: item.description,
    section: "Layanan",
    category: item.category,
    href: item.href || "/layanan",
    keywords: [item.title, item.description, item.category].join(" "),
  })),

  ...serviceCategories.map((item, index) => ({
    id: `layanan-kategori-${index}`,
    title: item.title,
    description: item.description,
    section: "Layanan",
    category: "Kategori",
    href: "/layanan",
    keywords: [item.title, item.description, ...(item.items || [])].join(" "),
  })),

  ...serviceRequirements.map((item, index) => ({
    id: `layanan-syarat-${index}`,
    title: item.title,
    description: (item.items || []).join(" • "),
    section: "Layanan",
    category: "Persyaratan",
    href: "/layanan/persyaratan",
    keywords: [item.title, ...(item.items || [])].join(" "),
  })),

  ...serviceFlow.map((item) => ({
    id: `layanan-alur-${item.step}`,
    title: `${item.step} - ${item.title}`,
    description: item.description,
    section: "Layanan",
    category: "Alur",
    href: "/layanan/alur",
    keywords: [item.step, item.title, item.description].join(" "),
  })),

  ...serviceFaqs.map((item, index) => ({
    id: `layanan-faq-${index}`,
    title: item.question,
    description: item.answer,
    section: "Layanan",
    category: "FAQ",
    href: "/layanan/faq",
    keywords: [item.question, item.answer].join(" "),
  })),

  {
    id: "profil-overview",
    title: profileOverview.title,
    description: profileOverview.description,
    section: "Profil",
    category: "Instansi",
    href: "/profil",
    keywords: [
      profileOverview.title,
      profileOverview.description,
      ...(profileOverview.highlights || []).map(
        (item) => `${item.title} ${item.description}`
      ),
    ].join(" "),
  },

  {
    id: "profil-visi-misi",
    title: "Visi & Misi",
    description: visionMission.vision,
    section: "Profil",
    category: "Visi & Misi",
    href: "/profil/visi-misi",
    keywords: [
      visionMission.vision,
      ...(visionMission.missions || []),
      ...(visionMission.values || []),
    ].join(" "),
  },

  ...leadershipProfiles.map((item, index) => ({
    id: `profil-pimpinan-${index}`,
    title: item.name,
    description: `${item.position} • ${item.description}`,
    section: "Profil",
    category: "Pimpinan",
    href: "/profil/pimpinan",
    keywords: [item.name, item.position, item.description].join(" "),
  })),

  ...galleryList.map((item) => ({
    id: `galeri-${item.slug}`,
    title: item.title,
    description: item.subtitle,
    section: "Galeri",
    category: item.category,
    href: "/galeri",
    keywords: [item.title, item.subtitle, item.category].join(" "),
  })),
];

export function searchSite(rawQuery = "") {
  const query = normalizeText(rawQuery);
  if (!query) return [];

  const terms = query.split(" ").filter(Boolean);

  return searchIndex
    .map((item) => {
      const haystack = normalizeText(
        [item.title, item.description, item.section, item.category, item.keywords].join(" ")
      );

      let score = 0;

      for (const term of terms) {
        if (normalizeText(item.title).includes(term)) score += 5;
        if (normalizeText(item.category).includes(term)) score += 3;
        if (haystack.includes(term)) score += 2;
      }

      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}