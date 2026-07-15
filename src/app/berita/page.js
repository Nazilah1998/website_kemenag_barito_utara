import BeritaPageClient from "@/components/features/berita/BeritaPageClient";
import {
  getBeritaPaginated,
  getAvailableBeritaMonthsDB,
} from "../../lib/berita";
import { BERITA_CATEGORIES } from "@/lib/berita-utils";
import { siteInfo } from "@/data/site";

const ITEMS_PER_PAGE = 18;

function clampPage(value, max) {
  if (!Number.isFinite(value) || value < 1) return 1;
  if (value > max) return max;
  return value;
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const category = typeof params?.category === "string" ? params.category : "";

  let dynamicTitle = "Berita";
  let dynamicDescription = "Publikasi berita dan informasi terbaru Kementerian Agama Kabupaten Barito Utara.";

  if (q) {
    dynamicTitle = `Pencarian Berita: ${q}`;
    dynamicDescription = `Hasil pencarian berita untuk kata kunci "${q}" di Kementerian Agama Kabupaten Barito Utara.`;
  } else if (category) {
    dynamicTitle = `Kategori Berita: ${category}`;
    dynamicDescription = `Kumpulan berita dengan kategori ${category} di Kementerian Agama Kabupaten Barito Utara.`;
  }

  return {
    title: dynamicTitle,
    description: dynamicDescription,
    alternates: {
      canonical: `${siteInfo.siteUrl}/berita`,
    },
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      url: `${siteInfo.siteUrl}/berita`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      description: dynamicDescription,
    },
  };
}

export const revalidate = 60;

export default async function BeritaPage({ searchParams }) {
  const params = await searchParams;

  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const category = typeof params?.category === "string" ? params.category : "";
  const month = typeof params?.month === "string" ? params.month : "";
  const sort = typeof params?.sort === "string" ? params.sort : "newest";
  
  const requestedPage = Number(params?.page ?? 1);
  const initialPage = !Number.isFinite(requestedPage) || requestedPage < 1 ? 1 : requestedPage;

  // Pagination Logic
  const isFirstPage = initialPage === 1;
  const limit = isFirstPage ? ITEMS_PER_PAGE + 1 : ITEMS_PER_PAGE;
  const offset = isFirstPage ? 0 : (initialPage - 1) * ITEMS_PER_PAGE + 1;

  const { data: dbData, total: totalResults } = await getBeritaPaginated({
    q,
    category,
    month,
    sort,
    limit,
    offset,
  });

  const categories = BERITA_CATEGORIES;
  const months = await getAvailableBeritaMonthsDB();

  const remainingTotal = Math.max(0, totalResults - 1);
  const totalPages = Math.max(1, Math.ceil(remainingTotal / ITEMS_PER_PAGE));
  const currentPage = clampPage(initialPage, totalPages);

  let latestNews = null;
  let remainingNews = [];

  if (isFirstPage && dbData.length > 0) {
    latestNews = dbData[0];
    remainingNews = dbData.slice(1);
  } else {
    remainingNews = dbData;
  }
  
  const paginatedNews = remainingNews;
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
