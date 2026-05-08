import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

function formatDate(value, locale = "id") {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  // Gunakan locale yang aktif untuk format tanggal
  const dateLocale = locale === "en" ? "en-US" : "id-ID";

  return new Intl.DateTimeFormat(dateLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function GalleryHeader({ count }) {
  const { t } = useLanguage();

  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">
          {t("gallery.badge")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
          {t("gallery.title")}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 md:text-base dark:text-slate-300">
          {t("gallery.subtitle")}
        </p>
      </div>
      <div className="w-fit rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          {t("gallery.totalItems")}
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{count}</p>
      </div>
    </div>
  );
}

export function GalleryCard({ item, onOpen }) {
  const { t, locale } = useLanguage();

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <button type="button" onClick={onOpen} className="block w-full cursor-zoom-in text-left">
        <div className="relative aspect-3/4 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent" />
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-slate-100">
            {t("gallery.viewImage")}
          </div>
        </div>
      </button>

      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {formatDate(item.publishedAt, locale)}
        </p>
        <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-6 text-slate-900 dark:text-slate-100">{item.title}</h3>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button type="button" onClick={onOpen} className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
            {t("gallery.preview")}
          </button>
          {item.linkUrl && (
            <Link href={item.linkUrl} className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300">
              {t("gallery.openNews")} <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function GalleryEmpty() {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">
        {t("nav.galeri")}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {t("gallery.empty")}
      </h2>
    </div>
  );
}

export function GalleryPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Halaman <span className="font-bold text-slate-900 dark:text-slate-100">{currentPage}</span> dari <span className="font-bold text-slate-900 dark:text-slate-100">{totalPages}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === 1}
          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Sebelumnya
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => {
              onPageChange(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${p === currentPage
                ? "bg-emerald-600 text-white shadow-md dark:bg-emerald-500"
                : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === totalPages}
          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
