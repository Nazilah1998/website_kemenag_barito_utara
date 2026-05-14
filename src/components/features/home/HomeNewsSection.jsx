"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeNewsSection({ latestBerita }) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === latestBerita.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? latestBerita.length - 1 : prev - 1));
  };

  return (
    <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-20">
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

        <Link
          href="/berita"
          className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-8 py-3 text-[11px] font-black uppercase tracking-widest text-slate-900 transition-all duration-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          {t("actions.viewAll") || "Lihat Semua Berita"}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {latestBerita.length > 0 ? (
        <>
          {/* 1. MOBILE & TABLET SLIDER (KHUSUS MOBILE/TABLET) */}
          <div className="mt-10 lg:hidden">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {latestBerita.map((item, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <div
                      key={item.slug}
                      className={`w-full flex-none px-1 transition-all duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isActive ? "scale-100 opacity-100" : "scale-90 opacity-40 blur-[1px]"}`}
                    >
                      <NewsCard item={item} index={index} t={t} isSlider />
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
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none ${activeIndex === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {latestBerita.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 bg-emerald-600" : "w-1.5 bg-slate-300 dark:bg-slate-700"}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={activeIndex === latestBerita.length - 1}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none ${activeIndex === latestBerita.length - 1 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 2. DESKTOP GRID - 6 KOLOM */}
          <div className="mt-10 hidden lg:grid lg:grid-cols-6 lg:gap-4 xl:gap-5">
            {latestBerita.slice(0, 12).map((item, index) => (
              <NewsCard
                key={item.slug}
                item={item}
                index={index}
                t={t}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="theme-news-empty mt-10 rounded-2xl p-10 text-center">
          <h3 className="text-xl font-black">{t("home.news.emptyTitle") || "Belum ada berita terbaru"}</h3>
          <p className="theme-text-muted mt-3 text-sm leading-7">
            {t("home.news.emptyDesc") || "Berita yang sudah dipublikasikan akan tampil otomatis di bagian ini."}
          </p>
        </div>
      )}
    </section>
  );
}

function NewsCard({ item, index, t, className = "", isSlider = false }) {
  return (
    <article className={`group relative h-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white transition-all duration-500 hover:-translate-y-3 hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] dark:border-slate-800 dark:bg-slate-900 ${isSlider ? 'mx-2' : ''} ${className}`}>
      <Link href={`/berita/${item.slug}`} className="flex h-full flex-col">
        {/* Image Area */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={item.coverImage || "/assets/branding/kemenag.svg"}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400">
              {t("actions.readMore")}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-800">
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </article>
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
