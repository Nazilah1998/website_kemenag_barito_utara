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
    <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
      <div className="relative">
        <div className="absolute -left-6 top-0 h-full w-1 bg-emerald-500 rounded-full opacity-50" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400">
          DOKUMENTASI VISUAL
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white lg:text-5xl">
          {t("gallery.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
          Koleksi dokumentasi visual resmi kegiatan Kementerian Agama Kabupaten Barito Utara yang merekam jejak pelayanan dan integritas.
        </p>
      </div>

      <div className="group relative overflow-hidden rounded-none border border-emerald-100 bg-white p-6 shadow-xl transition-all duration-500 hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-500/5 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/15" />
        <div className="relative flex flex-col items-center md:items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
            Total Dokumentasi
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{count}</span>
            <span className="text-xs font-bold text-slate-400">Aset</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryCard({ item, onOpen, isActive, onToggle }) {
  const { t, locale } = useLanguage();

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = `Kemenag_Barut_Galeri_${new Date(item.publishedAt).getTime()}.jpg`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mendownload gambar:", error);
      window.open(item.imageUrl, '_blank');
    }
  };

  const handleTap = (e) => {
    // Only toggle on touch devices/mobile
    if (window.innerWidth < 1024) {
      e.stopPropagation();
      if (onToggle) {
        onToggle();
      }
    }
  };

  return (
    <article
      onClick={handleTap}
      className="group relative aspect-[3/4] overflow-hidden rounded-none border border-slate-200/60 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition duration-700 group-hover:scale-110"
          unoptimized
        />
        {/* Multi-layered Overlays */}
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent transition-opacity duration-500 ${isActive ? "opacity-90" : "opacity-60 lg:group-hover:opacity-90"}`} />
        <div className={`absolute inset-0 bg-emerald-950/20 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"}`} />
      </div>

      {/* Floating Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        {/* Top Section */}
        <div className={`flex justify-between items-start transition-all duration-500 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0"}`}>
          <div className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 lg:px-3 lg:py-1.5 text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-white">
            HD Quality
          </div>
          <button
            onClick={handleDownload}
            className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-500 shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 lg:h-4 lg:w-4" fill="none" stroke="currentColor" strokeWidth="3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>
        </div>

        {/* Bottom Section */}
        <div className="transform transition-all duration-500">
          <div className={`flex items-center gap-2 text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-emerald-400 transition-all duration-500 ${isActive ? "opacity-100" : "opacity-0 lg:opacity-100"}`}>
            <span className="h-0.5 w-3 lg:w-4 rounded-full bg-emerald-500" />
            {formatDate(item.publishedAt, locale)}
          </div>
          <h3 className="sr-only">{item.title}</h3>

          <div className={`mt-4 lg:mt-6 overflow-hidden transition-all duration-500 ${isActive ? "max-h-12 opacity-100" : "max-h-0 opacity-0 lg:group-hover:max-h-12 lg:group-hover:opacity-100"}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-2 lg:py-3 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-emerald-500 shadow-lg"
            >
              <span>{t("gallery.preview")}</span>
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 lg:h-3 lg:w-3" fill="none" stroke="currentColor" strokeWidth="4.5">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
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
    <div className="mt-16 flex flex-col gap-6 md:flex-row md:items-center">
      <div className="flex-1 text-center md:text-left">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Halaman <span className="font-bold text-slate-900 dark:text-slate-100">{currentPage}</span> dari <span className="font-bold text-slate-900 dark:text-slate-100">{totalPages}</span>
        </p>
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-center gap-2">
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

      <div className="hidden flex-1 md:block" />
    </div>
  );
}
