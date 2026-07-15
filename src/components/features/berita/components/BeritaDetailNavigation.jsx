"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const FALLBACK_IMAGE = "/assets/branding/kemenag.svg";
import { formatDate } from "@/lib/date-utils";

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
          <AdjacentLink label={t("newsDetail.prevArticle")} item={adjacent?.older} locale={locale} t={t} />
            <AdjacentLink label={t("newsDetail.nextArticle")} item={adjacent?.newer} align="right" locale={locale} t={t} />
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
          <div className="grid gap-3 sm:gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {relatedItems.map((item) => (
              <RelatedCard key={item.id} item={item} t={t} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function AdjacentLink({ label, item, align = "left", locale, t }) {
  const [imgSrc, setImgSrc] = useState(null);
  
  if (!item) return null;
  const displayCategory = t ? (t(`berita.categories.${item.category}`) || item.category) : item.category;

  return (
    <Link href={`/berita/${item.slug}`} className={`group flex flex-row items-center gap-4 rounded-[28px] border border-slate-200 bg-white p-3 sm:p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${align === "right" ? "flex-row-reverse" : ""}`}>
      <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
         <Image src={imgSrc || item.coverImage || FALLBACK_IMAGE} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-110" onError={() => setImgSrc(FALLBACK_IMAGE)} />
      </div>
      <div className={`flex flex-col justify-center flex-1 min-w-0 ${align === "right" ? "text-right" : "text-left"}`}>
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 mb-1">{label}</p>
        {displayCategory && (
          <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.1em] text-emerald-600/80 dark:text-emerald-500/80 mb-2">
            {displayCategory}
          </p>
        )}
        <h3 className="text-sm sm:text-base font-bold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 mb-1.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{item.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{formatDate(item.isoDate, locale)}</p>
      </div>
    </Link>
  );
}

function RelatedCard({ item, t, locale }) {
  const [imgSrc, setImgSrc] = useState(null);
  const displayDate = formatDate(item.isoDate, locale);
  const displayCategory = t(`berita.categories.${item.category}`) || item.category;

  return (
    <article className="relative group flex flex-row md:flex-col overflow-hidden rounded-2xl md:rounded-[28px] border border-slate-200 bg-white shadow-sm transition md:hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-emerald-500">
      <div className="relative block w-[100px] sm:w-[120px] md:w-full shrink-0 aspect-square md:aspect-16/10 bg-slate-100 dark:bg-slate-800">
        <Image src={imgSrc || item.coverImage || FALLBACK_IMAGE} alt={item.title} fill className="object-cover transition duration-500 md:group-hover:scale-[1.03]" sizes="(max-width: 768px) 120px, (max-width: 1024px) 50vw, 25vw" onError={() => setImgSrc(FALLBACK_IMAGE)} />
      </div>
      <div className="flex flex-col justify-center flex-1 p-3 sm:p-4 md:p-5 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="truncate">{displayDate}</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">{displayCategory}</span>
        </div>
        <h3 className="mt-1 md:mt-3 text-sm md:text-lg font-bold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 md:line-clamp-2">
          <Link href={`/berita/${item.slug}`} className="transition hover:text-emerald-700 dark:hover:text-emerald-400 before:absolute before:inset-0 focus-visible:outline-none">{item.title}</Link>
        </h3>
        <span className="hidden md:inline-flex mt-5 items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800 dark:text-emerald-400 dark:group-hover:text-emerald-300">
          {t("newsDetail.readArticle")}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </article>
  );
}
