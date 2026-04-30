import React from "react";
import { IconPlus } from "./BeritaIcons";
import { ModernSelect } from "./BeritaUI";

export function BeritaFilters({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  yearFilter,
  setYearFilter,
  monthFilter,
  setMonthFilter,
  yearOptions,
  monthOptions,
  onAddClick,
  filteredCount,
  totalCount,
}) {
  const statusOptions = [
    { key: "all", label: "Semua" },
    { key: "published", label: "Tayang" },
    { key: "draft", label: "Draft" },
  ];

  return (
    <div className="mb-8 flex flex-col gap-8">
      {/* Top Section: Title & Add Button */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Berita
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Kelola artikel, pengumuman, dan berita terbaru instansi.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 active:scale-95 dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-slate-200"
        >
          <IconPlus />
          <span>Tambah Berita</span>
        </button>
      </div>

      {/* Filter Card - Premium Glass-like effect in light mode */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-8 shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-[2fr_1.5fr_1fr_1fr]">
          {/* Search */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Cari Berita
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Judul, kategori, atau ringkasan..."
                className="h-14 w-full rounded-2xl border border-slate-100 bg-white pl-12 pr-4 text-sm font-bold text-slate-900 outline-none ring-offset-2 transition-all focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:ring-white/10"
              />
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Status Tayang
            </label>
            <div className="flex h-14 items-center gap-1 rounded-2xl bg-white p-1.5 border border-slate-100 shadow-sm dark:bg-slate-800 dark:border-none">
              {statusOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setStatusFilter(opt.key)}
                  className={`flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase tracking-wider transition-all ${statusFilter === opt.key
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-slate-700 dark:text-white dark:shadow-none"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <ModernSelect
            label="Tahun"
            name="year"
            value={yearOptions.find(o => o.key === yearFilter)?.label || "Semua Tahun"}
            options={[{ key: "all", label: "Semua Tahun" }, ...yearOptions].map(o => o.label)}
            onChange={(e) => {
              const selected = [{ key: "all", label: "Semua Tahun" }, ...yearOptions].find(o => o.label === e.target.value);
              setYearFilter(selected?.key || "all");
            }}
          />

          <ModernSelect
            label="Bulan"
            name="month"
            value={monthOptions.find(o => o.key === monthFilter)?.label || "Semua Bulan"}
            options={[{ key: "all", label: "Semua Bulan" }, ...monthOptions].map(o => o.label)}
            onChange={(e) => {
              const selected = [{ key: "all", label: "Semua Bulan" }, ...monthOptions].find(o => o.label === e.target.value);
              setMonthFilter(selected?.key || "all");
            }}
          />
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Ditemukan {filteredCount} dari {totalCount} total berita
            </p>
          </div>

          {(query || statusFilter !== "all" || yearFilter !== "all" || monthFilter !== "all") && (
            <button
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setYearFilter("all");
                setMonthFilter("all");
              }}
              className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 px-3 py-1.5 rounded-lg dark:bg-transparent"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
