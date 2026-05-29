"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import FillImageWithFallback from "@/components/features/berita/components/FillImageWithFallback";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 18
    }
  }
};

export default function HomeNewsSection({ latestBerita = [], popularBerita = [] }) {
  const { t, locale } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const latestList = latestBerita || [];
  const popularList = popularBerita || [];

  const displayLatest = latestList.slice(0, 6);
  const displayPopular = popularList.slice(0, 6);

  const isEn = locale === "en";
  const latestBadgeText = isEn ? "LATEST NEWS" : "BERITA TERBARU";
  const popularBadgeText = isEn ? "POPULAR" : "TERPOPULER";
  const popularTitleText = isEn ? "Popular News" : "Berita Terpopuler";

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === displayLatest.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? displayLatest.length - 1 : prev - 1));
  };

  if (displayLatest.length === 0) {
    return (
      <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-20 overflow-hidden">
        <div className="theme-news-empty rounded-2xl p-10 text-center">
          <h3 className="text-xl font-black">{t("home.news.emptyTitle") || "Belum ada berita terbaru"}</h3>
          <p className="theme-text-muted mt-3 text-sm leading-7">
            {t("home.news.emptyDesc") || "Berita yang sudah dipublikasikan akan tampil otomatis di bagian ini."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-20 overflow-hidden">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700 dark:text-emerald-300">
            {t("nav.berita")}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight lg:text-4xl">
            {t("home.news.title") || "Ikuti pembaruan kegiatan dan informasi terkini"}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            {t("home.news.description") || "Berita resmi dari Kementerian Agama Kabupaten Barito Utara untuk masyarakat."}
          </p>
        </div>

        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/berita"
            className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-8 py-3 text-[11px] font-black uppercase tracking-widest text-slate-900 transition-all duration-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            {t("actions.viewAll") || "Lihat Semua Berita"}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* 1. MOBILE & TABLET LAYOUT (lg:hidden) */}
      <div className="mt-10 lg:hidden space-y-12">
        {/* Slider for latest news */}
        <div>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {displayLatest.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={item.slug}
                    className={`w-full flex-none px-1 transition-all duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isActive ? "scale-100 opacity-100" : "scale-90 opacity-40 blur-[1px]"}`}
                  >
                    <NewsCard item={item} index={index} t={t} isSlider priority={index === activeIndex} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={prevSlide}
              disabled={activeIndex === 0}
              aria-label="Berita sebelumnya"
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none ${activeIndex === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {displayLatest.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 bg-emerald-600" : "w-1.5 bg-slate-300 dark:bg-slate-700"}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={activeIndex === displayLatest.length - 1}
              aria-label="Berita berikutnya"
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none ${activeIndex === displayLatest.length - 1 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Popular news list on Mobile */}
        {displayPopular.length > 0 && (
          <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-md">
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                {popularBadgeText}
              </span>
              <h3 className="text-xl font-black mt-1 text-slate-900 dark:text-white">
                {popularTitleText}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {displayPopular.map((item, index) => (
                <Link
                  key={item.slug}
                  href={`/berita/${item.slug}`}
                  className="group flex gap-4 items-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50"
                >
                  {/* Cover Image */}
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-800">
                    <FillImageWithFallback
                      src={item.coverImage}
                      fallbackSrc="/assets/branding/kemenag.svg"
                      alt={item.title}
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Info Content */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-0.5">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                      <span>{item.date}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {item.views}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. DESKTOP LAYOUT (lg:grid) */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 mt-10">
        {/* Left Column: Latest News (Col span 8) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 flex-shrink-0">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              {latestBadgeText}
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 flex-grow"
          >
            {displayLatest.map((item, index) => (
              <NewsCard
                key={item.slug}
                item={item}
                index={index}
                t={t}
                priority={index === 0}
              />
            ))}
          </motion.div>
        </div>

        {/* Right Column: Popular News (Col span 4) */}
        {displayPopular.length > 0 && (
          <div className="lg:col-span-4 flex flex-col">
            {/* Spacer header matching the height of the left header perfectly */}
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 opacity-0 select-none pointer-events-none hidden lg:block flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">SPACER</span>
            </div>

            <div className="flex-grow flex flex-col">
              <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-md flex flex-col h-full">
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-4 flex-shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                    {popularBadgeText}
                  </span>
                  <h3 className="text-xl font-black mt-1 text-slate-900 dark:text-white">
                    {popularTitleText}
                  </h3>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-2">
                  {displayPopular.map((item, index) => (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="flex-grow flex flex-col justify-center"
                    >
                      <Link
                        href={`/berita/${item.slug}`}
                        className="group flex gap-4 items-center p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 w-full"
                      >
                        {/* Cover Image */}
                        <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-800">
                          <FillImageWithFallback
                            src={item.coverImage}
                            fallbackSrc="/assets/branding/kemenag.svg"
                            alt={item.title}
                            sizes="96px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Info Content */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {item.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-0.5">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            <span>{item.date}</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {item.views}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function NewsCard({ item, index, t, className = "", isSlider = false, priority = false }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className={`group relative h-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-lg transition-all duration-500 hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] dark:border-slate-800 dark:bg-slate-900 ${isSlider ? 'mx-2' : ''} ${className}`}
    >
      <Link href={`/berita/${item.slug}`} className="flex h-full flex-col">
        {/* Image Area */}
        <div className="relative h-48 w-full overflow-hidden">
          <FillImageWithFallback
            src={item.coverImage}
            fallbackSrc="/assets/branding/kemenag.svg"
            alt={item.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={priority}
          />

          {/* Elegant Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

          {/* Category Badge - Floating style */}
          <div className="absolute left-4 top-4 z-10">
            <div className="rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
              {item.category}
            </div>
          </div>

          {/* Date Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400">
              <span className="h-0.5 w-4 rounded-full bg-emerald-500/50" />
              {item.date}
            </div>
            <h3 className="mt-2 line-clamp-2 text-sm font-black leading-tight text-white transition-colors group-hover:text-emerald-50">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-6">
          <p className="line-clamp-3 text-[11px] leading-6 text-slate-500 dark:text-slate-400 lg:leading-5">
            {item.excerpt || "Baca selengkapnya mengenai berita terbaru dari Kementerian Agama Kabupaten Barito Utara..."}
          </p>

          <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50 dark:border-white/5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-colors group-hover:text-emerald-600 dark:text-slate-400 dark:group-hover:text-emerald-400">
              {t("actions.readMore")}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-800">
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
