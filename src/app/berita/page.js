import BeritaPageClient from "@/components/features/berita/BeritaPageClient";
import {
  filterAndSortBerita,
  getAllBerita,
  getAvailableBeritaCategories,
} from "../../lib/berita";

const ITEMS_PER_PAGE = 12;

function getAvailableBeritaMonths(items = []) {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  });

  const uniqueMonths = new Map();

  items.forEach((item) => {
    const isoDate = String(item.isoDate || "");
    const monthValue = isoDate.slice(0, 7);

    if (!monthValue || uniqueMonths.has(monthValue)) return;

    const date = new Date(`${monthValue}-01T00:00:00`);
    if (Number.isNaN(date.getTime())) return;

    const formatted = formatter.format(date);
    const label = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    uniqueMonths.set(monthValue, {
      value: monthValue,
      label,
    });
  });

  return Array.from(uniqueMonths.values()).sort((a, b) =>
    b.value.localeCompare(a.value),
  );
}

function clampPage(value, max) {
  if (!Number.isFinite(value) || value < 1) return 1;
  if (value > max) return max;
  return value;
}

export const metadata = {
  title: "Berita",
  description:
    "Publikasi berita dan informasi terbaru Kementerian Agama Kabupaten Barito Utara.",
  alternates: {
    canonical: "/berita",
  },
  openGraph: {
    title: "Berita",
    description:
      "Publikasi berita dan informasi terbaru Kementerian Agama Kabupaten Barito Utara.",
    url: "/berita",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Berita",
    description:
      "Publikasi berita dan informasi terbaru Kementerian Agama Kabupaten Barito Utara.",
  },
};

export const dynamic = "force-dynamic";

export default async function BeritaPage({ searchParams }) {
  const params = await searchParams;

  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const category = typeof params?.category === "string" ? params.category : "";
  const month = typeof params?.month === "string" ? params.month : "";
  const sort = typeof params?.sort === "string" ? params.sort : "newest";

  const beritaList = await getAllBerita();
  const categories = getAvailableBeritaCategories(beritaList);
  const months = getAvailableBeritaMonths(beritaList);

  const filteredBerita = filterAndSortBerita(beritaList, {
    q,
    category,
    month,
    sort,
  });

  const totalResults = filteredBerita.length;
  const latestNews = filteredBerita[0] ?? null;
  const remainingNews = filteredBerita.slice(1);

  const totalPages = Math.max(
    1,
    Math.ceil(remainingNews.length / ITEMS_PER_PAGE),
  );

  const currentPage = clampPage(Number(params?.page ?? 1), totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = remainingNews.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const showFeatured = currentPage === 1 && latestNews;

  return (
    <BeritaPageClient
      categories={categories}
      months={months}
      values={{ q, category, month, sort }}
      totalResults={totalResults}
      latestNews={latestNews}
      paginatedNews={paginatedNews}
      remainingNews={remainingNews}
      currentPage={currentPage}
      totalPages={totalPages}
      showFeatured={showFeatured}
    />
  );
}
