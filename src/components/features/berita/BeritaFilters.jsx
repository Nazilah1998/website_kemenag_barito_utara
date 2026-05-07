"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const SORT_OPTIONS = (t) => [
    { value: "newest", label: t("berita.allMonths") === "All months" ? "Newest" : "Terbaru" },
    { value: "oldest", label: t("berita.allMonths") === "All months" ? "Oldest" : "Terlama" },
    { value: "popular", label: t("berita.allMonths") === "All months" ? "Popular" : "Terpopuler" },
];

function FilterChip({ children }) {
    return (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:text-sm dark:border-emerald-900/60 dark:bg-emerald-900/30 dark:text-emerald-300">
            {children}
        </span>
    );
}

function FieldLabel({ htmlFor, children }) {
    return (
        <label
            htmlFor={htmlFor}
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
            {children}
        </label>
    );
}

function InputClassName() {
    return "h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/40";
}

export default function BeritaFilters({
    categories = [],
    months = [],
    values = {},
    totalResults = 0,
}) {
    const { t, locale } = useLanguage();
    const q = values.q || "";
    const category = values.category || "";
    const month = values.month || "";
    const sort = values.sort || "newest";

    const hasActiveFilters =
        Boolean(q) || Boolean(category) || Boolean(month) || sort !== "newest";

    const options = SORT_OPTIONS(t);
    const selectedMonthLabel = React.useMemo(() => {
        if (!month) return "";
        const [year, m] = month.split("-");
        const date = new Date(Number(year), Number(m) - 1, 1);
        if (Number.isNaN(date.getTime())) return month;
        return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
            month: "long",
            year: "numeric",
        }).format(date);
    }, [month, locale]);

    const translatedCategories = React.useMemo(() => {
        return categories.map(cat => ({
            value: cat,
            label: t(`berita.categories.${cat}`) || cat
        }));
    }, [categories, t]);

    const translatedMonths = React.useMemo(() => {
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

    const inputClassName = InputClassName();

    return (
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-colors sm:mb-10 sm:rounded-[28px] sm:p-6 lg:p-7 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400 sm:text-xs">
                            {t("berita.filterSystem")}
                        </p>
                        <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            {t("berita.filterTitle")}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {t("berita.filterDesc")}
                        </p>
                    </div>

                    <div className="shrink-0">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {Number(totalResults || 0).toLocaleString(locale === "en" ? "en-US" : "id-ID")} {t("berita.found")}
                        </span>
                    </div>
                </div>

                <form action="/berita" method="GET" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
                        <div className="xl:col-span-5">
                            <FieldLabel htmlFor="q">{t("berita.searchLabel")}</FieldLabel>
                            <input
                                id="q"
                                name="q"
                                type="text"
                                defaultValue={q}
                                placeholder={t("berita.searchPlaceholder")}
                                className={inputClassName}
                            />
                        </div>

                        <div className="md:col-span-1 xl:col-span-3">
                            <FieldLabel htmlFor="category">{t("berita.categoryLabel")}</FieldLabel>
                            <select
                                id="category"
                                name="category"
                                defaultValue={category}
                                className={inputClassName}
                            >
                                <option value="">{t("berita.allCategories")}</option>
                                {translatedCategories.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1 xl:col-span-2">
                            <FieldLabel htmlFor="month">{t("berita.monthLabel")}</FieldLabel>
                            <select
                                id="month"
                                name="month"
                                defaultValue={month}
                                className={inputClassName}
                            >
                                <option value="">{t("berita.allMonths")}</option>
                                {translatedMonths.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2 xl:col-span-2">
                            <FieldLabel htmlFor="sort">{t("berita.sortLabel")}</FieldLabel>
                            <select
                                id="sort"
                                name="sort"
                                defaultValue={sort}
                                className={inputClassName}
                            >
                                {options.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <button
                            type="submit"
                            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                        >
                            {t("berita.applyFilter")}
                        </button>

                        <Link
                            href="/berita"
                            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            {t("berita.resetFilter")}
                        </Link>
                    </div>
                </form>

                {hasActiveFilters ? (
                    <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div className="flex flex-wrap items-center gap-2">
                            {q ? <FilterChip>{t("berita.keyword")}: {q}</FilterChip> : null}
                            {category ? <FilterChip>{t("berita.categoryLabel")}: {t(`berita.categories.${category}`) || category}</FilterChip> : null}
                            {month ? <FilterChip>{t("berita.monthLabel")}: {selectedMonthLabel}</FilterChip> : null}
                            {sort !== "newest" ? (
                                <FilterChip>{t("berita.sort")}: {selectedSortLabel}</FilterChip>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}