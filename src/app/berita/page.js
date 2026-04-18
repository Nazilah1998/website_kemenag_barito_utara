import Image from "next/image";
import Link from "next/link";
import PageBanner from "../../components/PageBanner";
import NewsPagination from "../../components/berita/NewsPagination";
import BeritaFilters from "../../components/berita/BeritaFilters";
import BeritaViewsBadge from "../../components/berita/BeritaViewsBadge";
import {
  filterAndSortBerita,
  getAllBerita,
  getAvailableBeritaCategories,
} from "../../lib/berita";

const ITEMS_PER_PAGE = 6;
const FALLBACK_IMAGE = "/images/placeholder-news.jpg";

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

function getCoverImage(item) {
  return item.coverImage || FALLBACK_IMAGE;
}

function FeaturedNewsCard({ item }) {
  if (!item) return null;

  return (
    <article className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="grid lg:grid-cols-[1.2fr_0.9fr]">
        <Link
          href={`/berita/${item.slug}`}
          className="relative block min-h-75 overflow-hidden bg-slate-100 dark:bg-slate-800"
        >
          <Image
            src={getCoverImage(item)}
            alt={item.title}
            fill
            className="object-cover transition duration-500 hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </Link>

        <div className="flex flex-col justify-center p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
            Berita Terbaru
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{item.date}</span>
            {item.category ? (
              <>
                <span>•</span>
                <span>{item.category}</span>
              </>
            ) : null}
          </div>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">
            <Link
              href={`/berita/${item.slug}`}
              className="hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {item.title}
            </Link>
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-300">
            {item.excerpt || "Berita terbaru dari Kemenag Barito Utara."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/berita/${item.slug}`}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Baca selengkapnya
            </Link>

            <BeritaViewsBadge views={item.views} />
          </div>
        </div>
      </div>
    </article>
  );
}

function NewsCard({ item }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <Link
        href={`/berita/${item.slug}`}
        className="relative block aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800"
      >
        <Image
          src={getCoverImage(item)}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>{item.date}</span>
          {item.category ? (
            <>
              <span>•</span>
              <span>{item.category}</span>
            </>
          ) : null}
        </div>

        <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900 dark:text-slate-100">
          <Link
            href={`/berita/${item.slug}`}
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            {item.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {item.excerpt || "Klik untuk membaca berita selengkapnya."}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={`/berita/${item.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Baca selengkapnya
            <span aria-hidden="true">→</span>
          </Link>

          <BeritaViewsBadge views={item.views} />
        </div>
      </div>
    </article>
  );
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
    <>
      <PageBanner
        title="Berita"
        description="Kumpulan Berita dan Informasi Terbaru Kantor Kementerian Agama Barito Utara."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Berita" }]}
      />

      <main className="bg-slate-50 transition-colors dark:bg-slate-950">
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <BeritaFilters
            categories={categories}
            months={months}
            values={{ q, category, month, sort }}
            totalResults={totalResults}
          />

          {showFeatured ? <FeaturedNewsCard item={latestNews} /> : null}

          <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
                Arsip Berita
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                Berita Lainnya
              </h2>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              {showFeatured
                ? `Menampilkan ${paginatedNews.length} dari ${remainingNews.length} berita arsip`
                : `Menampilkan ${paginatedNews.length} dari ${totalResults} berita`}
            </div>
          </div>

          {paginatedNews.length > 0 ? (
            <>
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paginatedNews.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>

              <NewsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/berita"
                searchParams={{ q, category, month, sort }}
              />
            </>
          ) : totalResults > 0 && showFeatured ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Belum ada berita arsip lain untuk halaman ini.
            </div>
          ) : (
            <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Berita tidak ditemukan
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Coba ubah kata kunci pencarian atau reset filter yang sedang
                aktif.
              </p>
              <Link
                href="/berita"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Reset filter
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
