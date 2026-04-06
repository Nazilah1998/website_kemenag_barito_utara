"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { searchSite } from "../lib/search";
import { useLanguage } from "../context/LanguageContext";

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const query = searchParams.get("q")?.trim() ?? "";
  const results = useMemo(() => searchSite(query), [query]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        {query ? (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("searchPage.resultFor")}{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                “{query}”
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {results.length} {t("searchPage.resultCount")}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("searchPage.emptyState")}
          </p>
        )}
      </div>

      {query && results.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          {t("common.noResults")}
        </div>
      ) : null}

      <div className="space-y-4">
        {results.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                {item.section}
              </span>
              <span className="text-slate-500 dark:text-slate-400">{item.category}</span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {item.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          </Link>
        ))}

import { searchSite } from "../lib/search";
import { useLanguage } from "../context/LanguageContext";

export default function SearchResultsClient({ initialQuery = "" }) {
  const { t } = useLanguage();
  const query = initialQuery.trim();
  const results = useMemo(() => searchSite(query), [query]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {query ? (
          <>
            <p className="text-sm text-slate-500">
              {t("searchPage.resultFor")} <span className="font-semibold">“{query}”</span>
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {results.length} {t("searchPage.resultCount")}
            </h2>
          </>
        ) : (
          <p className="text-slate-600">{t("searchPage.emptyState")}</p>
        )}

        {query && results.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
            {t("common.noResults")}
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {results.map((item) => (
            <Link
              key={`${item.href}-${item.title}`}
              href={item.href}
              className="block rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                  {item.section}
                </span>
                <span>{item.category}</span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}