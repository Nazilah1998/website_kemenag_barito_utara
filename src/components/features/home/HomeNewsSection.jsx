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
          className="theme-outline-button group inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition lg:flex"
        >
          {t("actions.viewAll")}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {latestBerita.length > 0 ? (
        <>
          {/* 1. MOBILE & TABLET SLIDER (KHUSUS MOBILE/TABLET) */}
          <div className="mt-10 lg:hidden">
            <div className="overflow-hidden rounded-[2.5rem]">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {latestBerita.map((item, index) => (
                  <div key={item.slug} className="w-full flex-none p-1">
                    <NewsCard item={item} index={index} t={t} isSlider />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation (Sesuai Apa Kata Mereka) */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                onClick={prevSlide}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-slate-400 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {latestBerita.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 bg-emerald-600" : "w-1.5 bg-slate-300"}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-slate-400 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 2. DESKTOP GRID */}
          <div className="mt-10 hidden lg:grid lg:grid-cols-4 lg:gap-6">
            {latestBerita.map((item, index) => (
              <NewsCard
                key={item.slug}
                item={item}
                index={index}
                t={t}
                className={index >= 4 ? "hidden xl:block" : ""}
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
    <article className={`theme-news-card group overflow-hidden rounded-[2rem] border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${isSlider ? 'mx-1' : ''} ${className}`}>
      <Link href={`/berita/${item.slug}`} className="block h-full">
        <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={item.coverImage || "/kemenag.svg"}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black text-white shadow-sm">
            {item.category}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{item.date}</div>
            <h3 className="mt-2 line-clamp-2 text-base font-black leading-tight text-white">{item.title}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.excerpt || t("actions.readMore")}</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {t("actions.readMore")}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/30">
              <ArrowRightIcon className="h-4 w-4" />
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
