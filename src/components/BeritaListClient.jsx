"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import SectionHeading from "./SectionHeading";

export default function BeritaListClient({ items }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(7);

  const categories = useMemo(
    () => ["Semua", ...new Set(items.map((item) => item.category))],
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === "Semua" || item.category === category;
      const keyword = query.trim().toLowerCase();

      const matchesQuery =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.excerpt.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword);

      return matchesCategory && matchesQuery;
    });
  }, [items, category, query]);

  function handleQueryChange(event) {
    setQuery(event.target.value);
    setVisibleCount(7);
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setVisibleCount(7);
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Belum ada berita untuk ditampilkan.
      </div>
    );
  }

  const featured = filteredItems[0];
  const restItems = filteredItems.slice(1, visibleCount);
  const hasMore = filteredItems.length > visibleCount;

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Publikasi"
        title="Berita dan kegiatan terbaru"
        description="Tampilan berita dibuat lebih rapi dengan fitur pencarian sederhana, filter kategori, dan tata letak yang lebih nyaman dibaca."
      />

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_0.75fr]">
        <div>
          <label htmlFor="search-berita" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
            Cari berita
          </label>
          <input
            id="search-berita"
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Cari judul, kategori, atau ringkasan berita"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div>
          <label htmlFor="filter-kategori" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
            Filter kategori
          </label>
          <select
            id="filter-kategori"
            value={category}
            onChange={handleCategoryChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {!filteredItems.length ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Tidak ada berita yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <>
          {featured && (
            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
                <div className="relative min-h-[260px] bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {featured.date} ·{" "}
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {featured.category}
                    </span>
                  </p>

                  <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100 md:text-3xl">
                    {featured.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
                    {featured.excerpt}
                  </p>

                  <Link
                    href={`/berita/${featured.slug}`}
                    className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Baca selengkapnya
                  </Link>
                </div>
              </div>
            </article>
          )}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {restItems.map((item) => (
              <article
                key={item.slug}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40"
              >
                <div className="relative h-52 bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>

                <div className="p-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.date} ·{" "}
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {item.category}
                    </span>
                  </p>

                  <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {item.excerpt}
                  </p>

                  <Link
                    href={`/berita/${item.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Baca selengkapnya →
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 6)}
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