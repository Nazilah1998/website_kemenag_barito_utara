"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { searchSite } from "../lib/search";
import { useLanguage } from "../context/LanguageContext";

function mergeResults(localResults, remoteResults) {
  const seen = new Set();
  const merged = [];

  for (const item of remoteResults) {
    const key = `${item.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({
      ...item,
      category: item.category || "Konten Dinamis",
      score: 99,
    });
  }

  for (const item of localResults) {
    const key = `${item.href}-${item.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  return merged;
}

export default function SearchResultsClient({ initialQuery = "" }) {
  const { t } = useLanguage();
  const query = initialQuery.trim();

  const localResults = useMemo(() => searchSite(query), [query]);

  const [remoteResults, setRemoteResults] = useState([]);
  const [remoteStatus, setRemoteStatus] = useState("idle");

  useEffect(() => {
    if (!query) {
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) {
        setRemoteStatus("loading");
      }
    });

    fetch(`/api/search?q=${encodeURIComponent(query)}&limit=15`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (cancelled) return;
        setRemoteResults(Array.isArray(data?.items) ? data.items : []);
        setRemoteStatus("success");
      })
      .catch(() => {
        if (cancelled) return;
        setRemoteResults([]);
        setRemoteStatus("error");
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [query]);

  const results = useMemo(() => {
    const remote = query ? remoteResults : [];
    return mergeResults(localResults, remote);
  }, [query, localResults, remoteResults]);

  const loadingRemote = query && remoteStatus === "loading";
  const showEmptyState =
    query && results.length === 0 && remoteStatus !== "loading";

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
              {loadingRemote ? " • memuat konten dinamis..." : ""}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("searchPage.emptyState")}
          </p>
        )}
      </div>

      {showEmptyState ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {t("common.noResults")}
        </div>
      ) : null}

      <div className="space-y-4">
        {results.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                {item.section}
              </span>
              {item.category ? <span>{item.category}</span> : null}
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {item.title}
            </h3>

            {item.description ? (
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}