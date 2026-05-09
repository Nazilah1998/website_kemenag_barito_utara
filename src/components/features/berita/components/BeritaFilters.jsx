"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const SORT_OPTIONS = (t) => [
    { value: "newest", label: t("berita.allMonths") === "All months" ? "Newest" : "Terbaru" },
    { value: "oldest", label: t("berita.allMonths") === "All months" ? "Oldest" : "Terlama" },
    { value: "popular", label: t("berita.allMonths") === "All months" ? "Popular" : "Terpopuler" },
];

function FilterChip({ children, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/30 dark:text-emerald-300 sm:text-xs">
            {children}
            {onRemove && (
                <button onClick={onRemove} className="hover:text-emerald-900 dark:hover:text-emerald-100">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="3">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            )}
        </span>
    );
}

function FieldLabel({ htmlFor, children }) {
    return (
        <label
            htmlFor={htmlFor}
            className="mb-2.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-emerald-400/80"
        >
            {children}
        </label>
    );
}

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
    const [isOpen, setIsOpen] = useState(false);

    // Create a stable update function
    const updateFilters = useCallback((newParams) => {
        setIsPending(true);
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        params.delete("page");
        router.push(`/berita?${params.toString()}`, { scroll: false });
        setTimeout(() => setIsPending(false), 500);
    }, [router, searchParams]);

    // Debounce search query
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
        setIsOpen(false);
        router.push("/berita", { scroll: false });
    };

    const hasActiveFilters =
        Boolean(values.q) || Boolean(values.category) || Boolean(values.month) || (values.sort && values.sort !== "newest");

    const translatedCategories = useMemo(() => {
        return categories.map(cat => ({
            value: cat,
            label: t(`berita.categories.${cat}`) || cat
        }));
    }, [categories, t]);

    const translatedMonths = useMemo(() => {
        return months.map(m => {
            const [year, mo] = m.value.split("-");
            const date = new Date(Number(year), Number(mo) - 1, 1);
            return {
                value: m.value,
                label: new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
                    month: "long",
                    year: "numeric",
                }).format(date)
            };
        });
    }, [months, locale]);

    const selectedMonthLabel = useMemo(() => {
        if (!values.month) return "";
        return translatedMonths.find(m => m.value === values.month)?.label || values.month;
    }, [values.month, translatedMonths]);

    const selectedSortLabel = useMemo(() => {
        return SORT_OPTIONS(t).find(o => o.value === (values.sort || "newest"))?.label;
    }, [values.sort, t]);

    const inputBaseClass = "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-800/50";

    return (
        <section className="group relative mb-12 overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
            {/* Background Decorative Element */}
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-1 w-6 rounded-full bg-emerald-500" />
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400 sm:text-[10px]">
                                    {t("berita.filterSystem")}
                                </p>
                            </div>

                            {/* Toggle Button (Now for both Mobile & Desktop) */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-emerald-600 hover:text-white dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-emerald-600 dark:hover:text-white"
                            >
                                <span className="hidden sm:inline">{isOpen ? "Sembunyikan Filter" : "Tampilkan Filter"}</span>
                                <span className="sm:hidden">{isOpen ? "Tutup" : "Filter"}</span>
                                <svg viewBox="0 0 24 24" fill="none" className={`h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'rotate-180' : ''}`} stroke="currentColor" strokeWidth="3">
                                    <path d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] mt-0 opacity-0 overflow-hidden'}`}>
                            <div className="overflow-hidden">
                                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white lg:text-4xl">
                                    {t("berita.filterTitle")}
                                </h2>
                                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 lg:text-sm">
                                    {t("berita.filterDesc")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-start lg:self-auto">
                        {isPending && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 animate-pulse">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce" />
                                Memproses...
                            </div>
                        )}
                        <div className="rounded-full bg-emerald-600/10 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 sm:text-[10px]">
                            {totalResults} {t("berita.found")}
                        </div>
                    </div>
                </div>

                {/* Filter Grid - Collapsable on All Screens */}
                <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                    <div className="overflow-hidden">
                        <div className="grid gap-6 pb-2 md:grid-cols-2 xl:grid-cols-12">
                            {/* Search Input */}
                            <div className="xl:col-span-5">
                                <FieldLabel htmlFor="q">{t("berita.searchLabel")}</FieldLabel>
                                <div className="relative group/input">
                                    <input
                                        id="q"
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t("berita.searchPlaceholder")}
                                        className={`${inputBaseClass} pl-11`}
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/input:text-emerald-600">
                                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="3">
                                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Category Select */}
                            <div className="xl:col-span-3">
                                <FieldLabel htmlFor="category">{t("berita.categoryLabel")}</FieldLabel>
                                <select
                                    id="category"
                                    value={values.category || ""}
                                    onChange={(e) => updateFilters({ category: e.target.value })}
                                    className={inputBaseClass}
                                >
                                    <option value="">{t("berita.allCategories")}</option>
                                    {translatedCategories.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Month Select */}
                            <div className="xl:col-span-2">
                                <FieldLabel htmlFor="month">{t("berita.monthLabel")}</FieldLabel>
                                <select
                                    id="month"
                                    value={values.month || ""}
                                    onChange={(e) => updateFilters({ month: e.target.value })}
                                    className={inputBaseClass}
                                >
                                    <option value="">{t("berita.allMonths")}</option>
                                    {translatedMonths.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort Select */}
                            <div className="xl:col-span-2">
                                <FieldLabel htmlFor="sort">{t("berita.sortLabel")}</FieldLabel>
                                <select
                                    id="sort"
                                    value={values.sort || "newest"}
                                    onChange={(e) => updateFilters({ sort: e.target.value })}
                                    className={inputBaseClass}
                                >
                                    {SORT_OPTIONS(t).map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Filters Summary - Always Visible if filters exist */}
                <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 lg:pt-6 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                        {!hasActiveFilters ? (
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 sm:text-[10px]">
                                Belum ada filter aktif
                            </span>
                        ) : (
                            <>
                                <span className="mr-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 sm:mr-2 sm:text-[10px]">
                                    Aktif:
                                </span>
                                {values.q && (
                                    <FilterChip onRemove={() => setSearchQuery("")}>
                                        &quot;{values.q}&quot;
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
                            </>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleReset}
                                className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 transition-colors hover:text-red-500 sm:text-[10px]"
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 transition-transform group-hover:rotate-90" stroke="currentColor" strokeWidth="3">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                                {t("berita.resetFilter")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}