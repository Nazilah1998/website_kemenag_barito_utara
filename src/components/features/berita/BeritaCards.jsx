"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BeritaViewsBadge from "./BeritaViewsBadge";

const FALLBACK_IMAGE = "/images/placeholder-news.jpg";

function getCoverImage(item) {
  return item.coverImage || FALLBACK_IMAGE;
}

function formatDate(isoDate, locale) {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function FeaturedNewsCard({ item }) {
  const { t, locale } = useLanguage();
  if (!item) return null;

  const displayDate = formatDate(item.isoDate, locale);
  const displayCategory = t(`berita.categories.${item.category}`) || item.category;

  return (
    <article className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="grid lg:grid-cols-[1.2fr_0.9fr]">
        <Link
          href={`/berita/${item.slug}`}
          className="relative block min-h-75 overflow-hidden bg-slate-100 dark:bg-slate-800"
        >
          <Image
            src={getCoverImage(item)}
            alt={item.title}
            fill
            className="object-cover transition duration-500 hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </Link>

        <div className="flex flex-col justify-center p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
            {t("berita.badge")}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{displayDate}</span>
            {item.category ? (
              <>
                <span>•</span>
                <span>{displayCategory}</span>
              </>
            ) : null}
          </div>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">
            <Link
              href={`/berita/${item.slug}`}
              className="hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {item.title}
            </Link>
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-300">
            {item.excerpt || (locale === "en" ? "Latest news from Kemenag Barito Utara." : "Berita terbaru dari Kemenag Barito Utara.")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/berita/${item.slug}`}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {t("actions.readMore")}
            </Link>

            <BeritaViewsBadge views={item.views} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function NewsCard({ item }) {
  const { t, locale } = useLanguage();
  const displayDate = formatDate(item.isoDate, locale);
  const displayCategory = t(`berita.categories.${item.category}`) || item.category;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <Link
        href={`/berita/${item.slug}`}
        className="relative block aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800"
      >
        <Image
          src={getCoverImage(item)}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </Link>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>{displayDate}</span>
          {item.category ? (
            <>
              <span>•</span>
              <span>{displayCategory}</span>
            </>
          ) : null}
        </div>

        <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900 dark:text-slate-100">
          <Link
            href={`/berita/${item.slug}`}
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            {item.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {item.excerpt || (locale === "en" ? "Click to read more news." : "Klik untuk membaca berita selengkapnya.")}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={`/berita/${item.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {t("actions.readMore")}
            <span aria-hidden="true">→</span>
          </Link>

          <BeritaViewsBadge views={item.views} />
        </div>
      </div>
    </article>
  );
}
