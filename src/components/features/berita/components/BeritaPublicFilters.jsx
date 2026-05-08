import React from "react";

export function BeritaPublicFilters({ 
  query, 
  handleQueryChange, 
  category, 
  handleCategoryChange, 
  categories 
}) {
  return (
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
  );
}
