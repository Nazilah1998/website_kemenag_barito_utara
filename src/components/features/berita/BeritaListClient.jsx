"use client";

import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import { useBeritaList } from "@/hooks/useBeritaList";
import { BeritaPublicFilters } from "./components/BeritaPublicFilters";
import { BeritaFeaturedCard, BeritaCard } from "./components/BeritaPublicCards";

export default function BeritaListClient({ items }) {
  const b = useBeritaList(items);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Belum ada berita untuk ditampilkan.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Publikasi" title="Berita dan kegiatan terbaru"
        description="Tampilan berita dibuat lebih rapi dengan fitur pencarian sederhana, filter kategori, dan tata letak yang lebih nyaman dibaca."
      />

      <BeritaPublicFilters
        query={b.query} handleQueryChange={b.handleQueryChange}
        category={b.category} handleCategoryChange={b.handleCategoryChange}
        categories={b.categories}
      />

      {!b.filteredItems.length ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Tidak ada berita yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <>
          <BeritaFeaturedCard item={b.featured} />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {b.restItems.map((item) => (
              <BeritaCard key={item.slug} item={item} />
            ))}
          </section>

          {b.hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={b.loadMore}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                Muat lebih banyak
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}