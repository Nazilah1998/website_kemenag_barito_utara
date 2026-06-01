"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import BeritaViewsBadge from "./BeritaViewsBadge";

const FALLBACK_IMAGE = "/assets/branding/kemenag.svg";

function getCoverImage(item) {
  return item.coverImage || FALLBACK_IMAGE;
}

function NewsCardImage({ item, className, sizes, ...rest }) {
  const [imgSrc, setImgSrc] = React.useState(null);
  return (
    <Image
      src={imgSrc || getCoverImage(item)}
      alt={item.title}
      fill
      className={className}
      sizes={sizes}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
      {...rest}
    />
  );
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
    <motion.article 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 14 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all duration-500 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
        <Link
          href={`/berita/${item.slug}`}
          className="relative block min-h-[280px] lg:min-h-[400px] overflow-hidden bg-slate-100 dark:bg-slate-800"
        >
          <NewsCardImage
            item={item}
            priority
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          <div className="absolute left-4 top-4 lg:left-8 lg:top-8 z-10">
            <div className="rounded-full bg-emerald-600 px-4 py-1.5 lg:px-6 lg:py-2 text-[9px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
              {t("berita.badge")}
            </div>
          </div>
        </Link>

        <div className="flex flex-col justify-center p-6 md:p-12 xl:p-16">
          <div className="flex items-center gap-3 text-[9px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            <span className="h-1 w-8 lg:w-10 rounded-full bg-emerald-500/20" />
            {displayDate}
          </div>

          <h2 className="mt-4 lg:mt-6 text-xl font-black leading-tight tracking-tight text-slate-900 dark:text-white lg:text-4xl">
            <Link
              href={`/berita/${item.slug}`}
              className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {item.title}
            </Link>
          </h2>

          <p className="mt-4 lg:mt-6 line-clamp-3 lg:line-clamp-none text-[11px] lg:text-sm leading-6 lg:leading-8 text-slate-500 dark:text-slate-400">
            {item.excerpt || (locale === "en" ? "Latest news from Kemenag Barito Utara." : "Berita terbaru dari Kemenag Barito Utara.") || "Baca selengkapnya mengenai berita terbaru dari Kementerian Agama Kabupaten Barito Utara."}
          </p>

          <div className="mt-6 lg:mt-10 flex flex-wrap items-center gap-4 lg:gap-6">
            <Link
              href={`/berita/${item.slug}`}
              className="inline-flex h-11 lg:h-14 items-center justify-center rounded-2xl bg-emerald-700 px-6 lg:px-8 text-[9px] lg:text-[11px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-500/20 dark:bg-emerald-600"
            >
              {t("actions.readMore")}
            </Link>

            <BeritaViewsBadge views={item.views} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function NewsCard({ item }) {
  const { t, locale } = useLanguage();
  const displayDate = formatDate(item.isoDate, locale);
  const displayCategory = t(`berita.categories.${item.category}`) || item.category;

  return (
    <motion.article 
      layout
      whileHover={{ y: -8, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white transition-colors duration-300 dark:border-white/5 dark:bg-slate-900"
    >
      <Link href={`/berita/${item.slug}`} className="flex h-full flex-col">
        {/* Image Area */}
        <div className="relative h-48 min-h-[192px] w-full overflow-hidden">
          <NewsCardImage
            item={item}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 16vw"
          />

          {/* Elegant Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          {/* Category Badge */}
          {item.category && (
            <div className="absolute left-4 top-4 z-10">
              <div className="rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                {displayCategory}
              </div>
            </div>
          )}

          {/* Date Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-center gap-2 text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-emerald-400">
              <span className="h-0.5 w-3 lg:w-4 rounded-full bg-emerald-500/50" />
              {displayDate}
            </div>
            <h3 className="mt-1 lg:mt-2 line-clamp-2 text-[11px] lg:text-sm font-black leading-tight text-white transition-colors group-hover:text-emerald-50">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-2.5 lg:p-5">
          <p className="line-clamp-2 text-[9px] leading-4 text-slate-500 dark:text-slate-300 lg:line-clamp-3 lg:text-[10px] lg:leading-5 xl:text-[11px] xl:leading-6">
            {item.excerpt || (locale === "en" ? "Click to read more news." : "Klik untuk membaca berita selengkapnya.")}
          </p>

          <div className="mt-auto pt-3 lg:pt-5 flex items-center justify-between border-t border-slate-50 dark:border-white/5">
            <div className="flex flex-col gap-1 lg:gap-2">
              <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400">
                {t("actions.readMore")}
              </span>
              <BeritaViewsBadge views={item.views} isSmall />
            </div>
            <div className="flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center rounded-lg lg:rounded-xl bg-slate-50 text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-800">
              <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5 lg:h-3 lg:w-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
