"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const SORT_OPTIONS = [
  { value: "newest", labelId: "Terbaru", labelEn: "Newest" },
  { value: "oldest", labelId: "Terlama", labelEn: "Oldest" },
  { value: "popular", labelId: "Terpopuler", labelEn: "Most Popular" },
];

// ── Reusable FilterChip for active filter display ──
function FilterChip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-300">
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full transition hover:bg-emerald-200 dark:hover:bg-emerald-700"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-2 w-2" stroke="currentColor" strokeWidth="3.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

// ── Modern styled select field ──
function SelectField({ id, label, value, onChange, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500"
        >
          {label}
        </label>
      )}
      <div className="group relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="
            h-11 w-full cursor-pointer appearance-none rounded-xl
            border border-slate-200 bg-slate-50/80
            pl-4 pr-9
            text-[12.5px] font-semibold text-slate-800
            outline-none ring-0
            transition-all duration-200
            hover:border-emerald-400 hover:bg-white
            focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200
            dark:hover:border-emerald-600
            dark:focus:border-emerald-500 dark:focus:bg-slate-800/60
          "
        >
          {children}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500 dark:text-slate-500">
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Search input field ──
function SearchField({ id, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500"
      >
        Pencarian
      </label>
      <div className="group relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            h-11 w-full rounded-xl
            border border-slate-200 bg-slate-50/80
            pl-10 pr-9
            text-[12.5px] font-medium text-slate-800
            placeholder:text-slate-400
            outline-none
            transition-all duration-200
            hover:border-emerald-400 hover:bg-white
            focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200
            dark:placeholder:text-slate-600
            dark:hover:border-emerald-600
            dark:focus:border-emerald-500 dark:focus:bg-slate-800/60
          "
        />
        {value && (
          <button
            onClick={() => onChange({ target: { value: "" } })}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="3">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// Main BeritaFilters Component
// ══════════════════════════════════════════
export default function BeritaFilters({
  categories = [],
  months = [],
  values = {},
  totalResults = 0,
}) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(values.q || "");
  const [isPending, setIsPending] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen width to automatically manage mobile state vs desktop layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updateFilters = useCallback((newParams) => {
    setIsPending(true);
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) { params.set(key, value); }
      else { params.delete(key); }
    });
    params.delete("page");
    router.push(`/berita?${params.toString()}`, { scroll: false });
    setTimeout(() => setIsPending(false), 500);
  }, [router, searchParams]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== (values.q || "")) {
        updateFilters({ q: searchQuery });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, values.q, updateFilters]);

  const handleReset = () => {
    setSearchQuery("");
    router.push("/berita", { scroll: false });
  };

  const hasActiveFilters =
    Boolean(values.q) ||
    Boolean(values.category) ||
    Boolean(values.month) ||
    (values.sort && values.sort !== "newest");

  const translatedCategories = useMemo(() =>
    categories.map(cat => ({
      value: cat,
      label: t(`berita.categories.${cat}`) || cat,
    })),
  [categories, t]);

  const translatedMonths = useMemo(() =>
    months.map(m => {
      const [year, mo] = m.value.split("-");
      const date = new Date(Number(year), Number(mo) - 1, 1);
      return {
        value: m.value,
        label: new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
          month: "long", year: "numeric",
        }).format(date),
      };
    }),
  [months, locale]);

  const selectedMonthLabel = useMemo(() => {
    if (!values.month) return "";
    return translatedMonths.find(m => m.value === values.month)?.label || values.month;
  }, [values.month, translatedMonths]);

  const sortOptions = SORT_OPTIONS.map(o => ({
    value: o.value,
    label: locale === "en" ? o.labelEn : o.labelId,
  }));

  const selectedSortLabel = sortOptions.find(o => o.value === (values.sort || "newest"))?.label;

  return (
    <section className="relative mb-8 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">

      {/* Top accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500" />

      <div className="p-5 sm:p-6">

        {/* ── Header row ── */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="block h-[3px] w-5 rounded-full bg-emerald-500" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
              {t("berita.filterSystem")}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {isPending && (
              <span className="text-[10px] font-semibold text-emerald-600 animate-pulse mr-1">
                Memproses...
              </span>
            )}
            
            {/* Beautiful Animated Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="
                flex lg:hidden items-center gap-2 rounded-xl
                bg-emerald-50 px-3.5 py-2 text-[11px] font-black uppercase tracking-wider text-emerald-700
                border border-emerald-200/60 shadow-sm
                transition-all duration-300
                active:scale-95 hover:bg-emerald-100/70
                dark:bg-emerald-950/20 dark:border-emerald-800/60 dark:text-emerald-400
                dark:hover:bg-emerald-950/40
              "
              aria-label="Toggle Filters"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 0-2.4 0-3.6 0M3 12c0-1.2 0-2.4 0-3.6M21 12c0 1.2 0 2.4 0 3.6M12 21c1.2 0 2.4 0 3.6 0" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M10 18h4" />
              </svg>
              <span>{isMobileFiltersOpen ? t("berita.hideFilters") : t("berita.showFilters")}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={`h-3 w-3 transition-transform duration-300 ${isMobileFiltersOpen ? "rotate-180" : ""}`}
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black tabular-nums text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-400">
              {totalResults} {t("berita.found")}
            </span>
          </div>
        </div>

        {/* ── Filter Grid with smooth height animation on mobile ── */}
        <AnimatePresence initial={false}>
          {(!isMobile || isMobileFiltersOpen) && (
            <motion.div
              initial={isMobile ? { height: 0, opacity: 0 } : false}
              animate={isMobile ? { height: "auto", opacity: 1 } : false}
              exit={isMobile ? { height: 0, opacity: 0 } : false}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 pt-1 pb-2">
                {/* Search — spans 5 cols */}
                <div className="lg:col-span-5">
                  <SearchField
                    id="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("berita.searchPlaceholder")}
                  />
                </div>

                {/* Category — spans 3 cols */}
                <div className="lg:col-span-3">
                  <SelectField
                    id="category"
                    label={t("berita.categoryLabel")}
                    value={values.category || ""}
                    onChange={(e) => updateFilters({ category: e.target.value })}
                  >
                    <option value="">{t("berita.allCategories")}</option>
                    {translatedCategories.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </SelectField>
                </div>

                {/* Month — spans 2 cols */}
                <div className="lg:col-span-2">
                  <SelectField
                    id="month"
                    label={t("berita.monthLabel")}
                    value={values.month || ""}
                    onChange={(e) => updateFilters({ month: e.target.value })}
                  >
                    <option value="">{t("berita.allMonths")}</option>
                    {translatedMonths.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </SelectField>
                </div>

                {/* Sort — spans 2 cols */}
                <div className="lg:col-span-2">
                  <SelectField
                    id="sort"
                    label={t("berita.sortLabel")}
                    value={values.sort || "newest"}
                    onChange={(e) => updateFilters({ sort: e.target.value })}
                  >
                    {sortOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </SelectField>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Active Filters Row ── */}
        <div className={`mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800 transition-all ${hasActiveFilters ? "opacity-100" : "opacity-60"}`}>
          {!hasActiveFilters ? (
            <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
              Belum ada filter aktif
            </span>
          ) : (
            <>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">
                Filter aktif:
              </span>
              {values.q && (
                <FilterChip onRemove={() => setSearchQuery("")}>
                  &ldquo;{values.q}&rdquo;
                </FilterChip>
              )}
              {values.category && (
                <FilterChip onRemove={() => updateFilters({ category: "" })}>
                  {t(`berita.categories.${values.category}`) || values.category}
                </FilterChip>
              )}
              {values.month && (
                <FilterChip onRemove={() => updateFilters({ month: "" })}>
                  {selectedMonthLabel}
                </FilterChip>
              )}
              {values.sort && values.sort !== "newest" && (
                <FilterChip onRemove={() => updateFilters({ sort: "newest" })}>
                  {selectedSortLabel}
                </FilterChip>
              )}
              <button
                onClick={handleReset}
                className="ml-auto flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-bold text-red-500 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                {t("berita.resetFilter")}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}