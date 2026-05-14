"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

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

export function BeritaDetailNavigation({ adjacent, relatedItems }) {
  const { t, locale } = useLanguage();

  return (
    <div className="mt-12 space-y-12">
      {adjacent?.older || adjacent?.newer ? (
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400">
              {t("newsDetail.continueReading")}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {t("newsDetail.exploreMore")}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AdjacentLink label={t("newsDetail.prevArticle")} item={adjacent?.older} locale={locale} />
            <AdjacentLink label={t("newsDetail.nextArticle")} item={adjacent?.newer} align="right" locale={locale} />
          </div>
        </section>
      ) : null}

      {relatedItems?.length > 0 ? (
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400">
              {t("newsDetail.recommendation")}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {t("newsDetail.relatedNews")}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedItems.map((item) => (
              <RelatedCard key={item.id} item={item} t={t} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function AdjacentLink({ label, item, align = "left", locale }) {
  if (!item) return null;
  return (
    <Link href={`/berita/${item.slug}`} className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700 dark:hover:bg-slate-800">
      <p className={`text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400 ${align === "right" ? "text-right" : ""}`}>{label}</p>
      <h3 className={`mt-3 text-base font-bold leading-7 text-slate-900 dark:text-slate-100 ${align === "right" ? "text-right" : ""}`}>{item.title}</h3>
      <p className={`mt-2 text-sm text-slate-500 dark:text-slate-400 ${align === "right" ? "text-right" : ""}`}>{formatDate(item.isoDate, locale)}</p>
    </Link>
  );
}

function RelatedCard({ item, t, locale }) {
  const displayDate = formatDate(item.isoDate, locale);
  const displayCategory = t(`berita.categories.${item.category}`) || item.category;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <Link href={`/berita/${item.slug}`} className="relative block aspect-16/10 bg-slate-100 dark:bg-slate-800">
        <Image src={item.coverImage || "/assets/branding/kemenag.svg"} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 33vw" />
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{displayDate}</span>
          <span>•</span>
          <span>{displayCategory}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2">
          <Link href={`/berita/${item.slug}`} className="transition hover:text-emerald-700 dark:hover:text-emerald-400">{item.title}</Link>
        </h3>
        <Link href={`/berita/${item.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
          {t("newsDetail.readArticle")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
