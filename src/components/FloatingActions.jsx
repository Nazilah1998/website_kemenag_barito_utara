"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteInfo, siteLinks } from "../data/site";

export default function FloatingActions() {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[70] flex flex-col gap-3 sm:right-6">
      <a
        href={siteLinks.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label={`Hubungi ${siteInfo.shortName} lewat WhatsApp`}
        className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-800"
      >
        WhatsApp
      </a>

      <Link
        href={siteInfo.complaintHref}
        aria-label="Buka halaman kontak"
        className="pointer-events-auto inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg transition hover:border-slate-400 hover:bg-slate-50"
      >
        Kontak
      </Link>

      {showTopButton && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-bold text-slate-700 shadow-lg transition hover:border-slate-400 hover:bg-slate-50"
        >
          ↑
        </button>
      )}
    </div>
  );
}