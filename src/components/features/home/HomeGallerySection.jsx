"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { GalleryLightbox } from "@/components/features/galeri/components/GalleryLightbox";

export default function HomeGallerySection({ latestGaleri = [] }) {
  const { t, locale } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tappedId, setTappedId] = useState(null);

  if (!latestGaleri || latestGaleri.length === 0) return null;

  const currentItem = selectedIndex >= 0 ? latestGaleri[selectedIndex] : null;

  const handleNextLightbox = () => {
    setSelectedIndex((prev) => (prev + 1) % latestGaleri.length);
  };

  const handlePrevLightbox = () => {
    setSelectedIndex((prev) => (prev - 1 + latestGaleri.length) % latestGaleri.length);
  };

  // Slider logic for mobile (No looping)
  const nextSlide = () => {
    if (activeIndex < latestGaleri.length - 1) {
      setActiveIndex((prev) => prev + 1);
      setTappedId(null); // Close overlay when sliding
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      setTappedId(null); // Close overlay when sliding
    }
  };

  return (
    <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="relative">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400">
            {t("gallery.badge") || "DOKUMENTASI VISUAL"}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white lg:text-4xl">
            {t("gallery.title") || "Galeri Kegiatan"}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            {t("gallery.subtitle") || "Rangkuman dokumentasi visual dari berbagai kegiatan pelayanan dan pembinaan di lingkungan Kementerian Agama Kabupaten Barito Utara."}
          </p>
        </div>

        <Link
          href="/galeri"
          className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-8 py-3 text-[11px] font-black uppercase tracking-widest text-slate-900 transition-all duration-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          {t("actions.viewAll") || "Lihat Semua Galeri"}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 1. MOBILE & TABLET SLIDER */}
      <div className="mt-10 lg:hidden">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {latestGaleri.map((item, index) => {
              const isSliderActive = index === activeIndex;
              const itemId = item.id || index;
              return (
                <div
                  key={itemId}
                  className={`w-full flex-none px-1 transition-all duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isSliderActive ? "scale-100 opacity-100" : "scale-90 opacity-40 blur-[1px]"}`}
                >
                  <GalleryCard
                    item={item}
                    locale={locale}
                    t={t}
                    onPreview={() => setSelectedIndex(index)}
                    isMobile={true}
                    isActive={tappedId === itemId}
                    onToggle={() => setTappedId(tappedId === itemId ? null : itemId)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Dots & Buttons (With End Stop logic) */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            disabled={activeIndex === 0}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-emerald-600 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 ${activeIndex === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          <div className="flex gap-1.5">
            {latestBeritaDots(latestGaleri).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-emerald-600" : "w-1 bg-slate-300"}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={activeIndex === latestGaleri.length - 1}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-emerald-600 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 ${activeIndex === latestGaleri.length - 1 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. DESKTOP GRID - 6 KOLOM 2 BARIS */}
      <div className="mt-12 hidden lg:grid lg:grid-cols-6 lg:gap-4 xl:gap-5">
        {latestGaleri.slice(0, 12).map((item, index) => (
          <GalleryCard
            key={item.id || index}
            item={item}
            locale={locale}
            t={t}
            onPreview={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {currentItem && (
        <GalleryLightbox
          item={currentItem}
          index={selectedIndex}
          total={latestGaleri.length}
          onClose={() => setSelectedIndex(-1)}
          onNext={handleNextLightbox}
          onPrev={handlePrevLightbox}
        />
      )}
    </section>
  );
}

// Helper to limit dots if needed, but here we use all items
function latestBeritaDots(items) {
  return items.slice(0, 12);
}

function GalleryCard({ item, locale, t, onPreview, isMobile = false, isActive = false, onToggle }) {
  const displayDate = item.publishedAt
    ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(item.publishedAt))
    : "";

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kemenag-barut-${item.id || "gallery"}.jpg`;
      link.download = `Kemenag_Barut_Galeri_${new Date(item.publishedAt).getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(item.imageUrl, "_blank");
    }
  };

  const handleTap = (e) => {
    if (isMobile) {
      e.stopPropagation();
      if (onToggle) onToggle();
    }
  };

  return (
    <article
      onClick={handleTap}
      className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-none border border-slate-200/60 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition duration-700 group-hover:scale-110"
          unoptimized
        />
        {/* Multi-layered Overlays */}
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-90' : 'opacity-70 lg:group-hover:opacity-90'}`} />
      </div>

      {/* Floating Buttons (Top) */}
      <div className={`absolute right-3 top-3 z-20 flex gap-2 transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'opacity-0 translate-y-[-10px] lg:group-hover:translate-y-0 lg:group-hover:opacity-100'}`}>
        <button
          onClick={handleDownload}
          className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 bg-white/20 text-white hover:bg-emerald-600 shadow-lg"
          title="Download"
        >
          <DownloadIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Floating Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <div className="transform transition-all duration-500">
          {displayDate && (
            <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
              <span className="h-0.5 w-4 rounded-full bg-emerald-500" />
              {displayDate}
            </div>
          )}

          <div className={`mt-4 overflow-hidden transition-all duration-500 ${isActive ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0 lg:group-hover:max-h-12 lg:group-hover:opacity-100'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-2.5 text-[9px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
            >
              {t("gallery.preview") || "PRATINJAU"}
            </button>
          </div>
        </div>
      </div>
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

function DownloadIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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
