"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import PageBanner from "@/components/common/PageBanner";
import BeritaFilters from "./components/BeritaFilters";
import { FeaturedNewsCard, NewsCard } from "./components/BeritaCards";
import NewsPagination from "./components/NewsPagination";

export default function BeritaPageClient({
  categories,
  months,
  values,
  totalResults,
  latestNews,
  paginatedNews,
  remainingNews,
  currentPage,
  totalPages,
  showFeatured
}) {
  const { t } = useLanguage();

  return (
    <>
      <PageBanner
        title={t("nav.berita")}
        description={t("home.news.description")}
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.berita") }
        ]}
      />

      <main className="bg-slate-50 transition-colors dark:bg-slate-950">
        <section className="w-full px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
          <BeritaFilters
            categories={categories}
            months={months}
            values={values}
            totalResults={totalResults}
          />

          {showFeatured ? <FeaturedNewsCard item={latestNews} /> : null}

          <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
                {t("berita.archiveBadge")}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {t("berita.archiveTitle")}
              </h2>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              {showFeatured
                ? `${t("berita.showing")} ${paginatedNews.length} ${t("berita.from")} ${remainingNews.length} ${t("berita.archiveNews")}`
                : `${t("berita.showing")} ${paginatedNews.length} ${t("berita.from")} ${totalResults} ${t("berita.news")}`}
            </div>
          </div>

          {paginatedNews.length > 0 ? (
            <>
              <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {paginatedNews.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>

              <NewsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/berita"
                searchParams={values}
              />
            </>
          ) : totalResults > 0 && showFeatured ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {t("berita.noArchive")}
            </div>
          ) : (
            <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {t("berita.notFound")}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {t("berita.notFoundDesc")}
              </p>
              <Link
                href="/berita"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                {t("berita.resetFilter")}
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
