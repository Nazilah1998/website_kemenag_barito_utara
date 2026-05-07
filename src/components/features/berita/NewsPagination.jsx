"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function ChevronLeftIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="m12.5 5-5 5 5 5" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="m7.5 5 5 5-5 5" />
        </svg>
    );
}

function buildPagination(totalPages, currentPage) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
}

function buildSearchString(searchParams = {}, page) {
    const params = new URLSearchParams();

    Object.entries(searchParams || {}).forEach(([key, value]) => {
        if (key === "page") return;
        if (value === undefined || value === null || value === "") return;

        if (Array.isArray(value)) {
            value
                .filter(Boolean)
                .forEach((item) => params.append(key, String(item)));
            return;
        }

        params.set(key, String(value));
    });

    if (page > 1) {
        params.set("page", String(page));
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
}

export default function NewsPagination({
    currentPage,
    totalPages,
    basePath = "/berita",
    searchParams = {},
}) {
    const { t } = useLanguage();
    if (totalPages <= 1) return null;

    const items = buildPagination(totalPages, currentPage);

    function pageHref(page) {
        return `${basePath}${buildSearchString(searchParams, page)}`;
    }

    return (
        <nav
            aria-label={t("nav.berita") + " pagination"}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
            <Link
                href={pageHref(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border text-slate-700 transition ${currentPage === 1
                    ? "pointer-events-none border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
                    : "border-slate-300 bg-white hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                    }`}
            >
                <ChevronLeftIcon />
            </Link>

            {items.map((item, index) =>
                item === "..." ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="inline-flex h-11 min-w-11 items-center justify-center px-2 text-sm font-semibold text-slate-500 dark:text-slate-400"
                    >
                        ...
                    </span>
                ) : (
                    <Link
                        key={item}
                        href={pageHref(item)}
                        aria-current={item === currentPage ? "page" : undefined}
                        className={`inline-flex h-11 min-w-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition ${item === currentPage
                            ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-600 dark:bg-emerald-600"
                            : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                            }`}
                    >
                        {item}
                    </Link>
                ),
            )}

            <Link
                href={pageHref(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage === totalPages}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border text-slate-700 transition ${currentPage === totalPages
                    ? "pointer-events-none border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
                    : "border-slate-300 bg-white hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                    }`}
            >
                <ChevronRightIcon />
            </Link>
        </nav>
    );
}