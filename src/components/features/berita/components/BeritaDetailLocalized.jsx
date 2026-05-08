"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BeritaDetailActions from "./BeritaDetailActions";

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

export function BeritaDetailBreadcrumb({ title }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-white/60">
      <Link href="/" className="hover:text-white transition">{t("nav.home")}</Link>
      <span className="text-white/40">/</span>
      <Link href="/berita" className="hover:text-white transition">{t("nav.berita")}</Link>
      <span className="text-white/40">/</span>
      <span className="text-white truncate max-w-[200px]">{title}</span>
    </div>
  );
}

export function BeritaDetailSidebar({ category, isoDate, views, title, slug }) {
  const { t, locale } = useLanguage();
  const displayDate = formatDate(isoDate, locale);
  const displayCategory = t(`berita.categories.${category}`) || category;

  return (
    <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("berita.infoTitle")}</p>
        <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <InfoRow label={t("berita.categoryLabel")} value={displayCategory} />
          <InfoRow label={t("berita.dateLabel")} value={displayDate} />
          <InfoRow label={t("berita.viewsLabel")} value={`${Number(views ?? 0).toLocaleString(locale === "en" ? "en-US" : "id-ID")} ${t("berita.readCount")}`} isRight />
        </div>
      </div>
      <BeritaDetailActions title={title} path={`/berita/${slug}`} />
    </aside>
  );
}

function InfoRow({ label, value, isRight = false }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span>{label}</span>
      <span className={`${isRight ? "text-right" : ""} font-semibold text-slate-900 dark:text-slate-100`}>{value}</span>
    </div>
  );
}

export function BeritaDetailBackLink() {
  const { t } = useLanguage();
  return (
    <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
      <span aria-hidden="true">←</span>
      {t("berita.backToNews")}
    </Link>
  );
}

export function BeritaDetailMetaPills({ isoDate, children }) {
  const { t, locale } = useLanguage();
  const displayDate = formatDate(isoDate, locale);

  return (
    <div className="flex flex-wrap gap-3">
      <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
        {t("berita.published")} {displayDate}
      </div>
      <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
        {children}
      </div>
    </div>
  );
}

export function BeritaDetailCategoryBadge({ category }) {
  const { t } = useLanguage();
  return (
    <div className="inline-flex rounded-full border border-white/15 bg-emerald-600/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
      {t(`berita.categories.${category}`) || category}
    </div>
  );
}
