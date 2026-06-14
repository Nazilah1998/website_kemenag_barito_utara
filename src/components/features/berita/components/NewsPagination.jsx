"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { buildPagination } from "@/lib/berita-utils";

function ChevronLeftIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 md:h-4 md:w-4"
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
            className="h-3.5 w-3.5 md:h-4 md:w-4"
            aria-hidden="true"
        >
            <path d="m7.5 5 5 5-5 5" />
        </svg>
    );
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
            className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-2 md:gap-3"
        >
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
              <Link
                href={pageHref(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
                className={`inline-flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-[10px] md:rounded-xl border text-slate-700 transition ${currentPage === 1
                    ? "pointer-events-none border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
                    : "border-slate-300 bg-white hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                    }`}
              >
                <ChevronLeftIcon />
              </Link>
            </motion.div>

            {items.map((item, index) =>
                item === "..." ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="inline-flex h-9 min-w-9 md:h-11 md:min-w-11 items-center justify-center px-1 md:px-2 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400"
                    >
                        ...
                    </span>
                ) : (
                    <motion.div key={item} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                      <Link
                          href={pageHref(item)}
                          aria-current={item === currentPage ? "page" : undefined}
                          aria-label={item === currentPage ? `Halaman ${item}` : `Ke halaman ${item}`}
                          className={`inline-flex h-9 min-w-9 md:h-11 md:min-w-11 items-center justify-center rounded-[10px] md:rounded-xl border px-3 md:px-4 text-xs md:text-sm font-semibold transition ${item === currentPage
                              ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-600 dark:bg-emerald-600"
                              : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                              }`}
                      >
                          {item}
                      </Link>
                    </motion.div>
                ),
            )}

            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
              <Link
                href={pageHref(Math.min(totalPages, currentPage + 1))}
                aria-disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
                className={`inline-flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-[10px] md:rounded-xl border text-slate-700 transition ${currentPage === totalPages
                    ? "pointer-events-none border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600"
                    : "border-slate-300 bg-white hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                    }`}
              >
                <ChevronRightIcon />
              </Link>
            </motion.div>
        </nav>
    );
}