"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteInfo } from "@/data/site";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { DesktopClockSection, MobileClockSection } from "./ClockSection";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      delay: 0.05,
    },
  },
};

const PORTAL_LINKS = [
  {
    title: "Website Utama",
    description: "Informasi publik, berita, dan layanan keagamaan terlengkap.",
    href: "/beranda",
    icon: (
      <svg
        className="w-8 h-8 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    primary: true,
  },
  {
    title: "Layanan PTSP",
    description:
      "Pusat Layanan Terpadu Satu Pintu untuk segala urusan administrasi.",
    href: "https://ptsp.kemenag-baritoutara.com/",
    icon: (
      <svg
        className="w-8 h-8 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Berita Terkini",
    description:
      "Update informasi dan kegiatan terbaru dari Kemenag Barito Utara.",
    href: "/berita",
    icon: (
      <svg
        className="w-8 h-8 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
  },
  {
    title: "Galeri Kegiatan",
    description: "Dokumentasi kegiatan dan publikasi Kementerian Agama.",
    href: "/galeri",
    icon: (
      <svg
        className="w-8 h-8 text-fuchsia-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Dokumen Laporan",
    description: "Dokumen akuntabilitas dan laporan publikasi instansi.",
    href: "/laporan/sop",
    icon: (
      <svg
        className="w-8 h-8 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Survey Layanan",
    description:
      "Bantu kami meningkatkan kualitas layanan dengan mengisi survey.",
    href: "/survey",
    icon: (
      <svg
        className="w-8 h-8 text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Zona Integritas",
    description:
      "Komitmen kami dalam mewujudkan birokrasi yang bersih dan melayani.",
    href: "/zona-integritas",
    icon: (
      <svg
        className="w-8 h-8 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 8.9c.228.033.445.133.615.285l2.772 2.443a.5.5 0 010 .744l-2.772 2.443a1.056 1.056 0 01-.615.285 3.323 3.323 0 00-6.013 3.116 3.323 3.323 0 006.013 3.116c.228-.033.445-.133.615-.285l2.772-2.443a.5.5 0 010-.744l-2.772-2.443a1.056 1.056 0 01.615-.285 3.323 3.323 0 006.013-3.116 3.323 3.323 0 00-6.013-3.116z"
        />
      </svg>
    ),
  },
  {
    title: "Kontak Kami",
    description: "Hubungi kami untuk informasi lebih lanjut dan bantuan.",
    href: "/kontak",
    icon: (
      <svg
        className="w-8 h-8 text-rose-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function PortalPage() {
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [portalData, setPortalData] = useState(null);
  const [portalLoading, setPortalLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal")
      .then((res) => res.json())
      .then((data) => {
        if (data?.beritaCount !== undefined) setPortalData(data);
      })
      .catch(() => {})
      .finally(() => setPortalLoading(false));
  }, []);

  useEffect(() => {
    const detectPwa = () => {
      if (typeof window !== "undefined") {
        const isPwa =
          window.matchMedia("(display-mode: standalone)").matches ||
          window.navigator.standalone ||
          document.referrer.includes("android-app://");
        setIsStandalone(isPwa);
      }
    };

    const frame = requestAnimationFrame(() => {
      setMounted(true);
      detectPwa();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 selection:bg-emerald-500/30">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/kantor-kemenag.jpg"
          alt="Kantor Kemenag Barito Utara"
          fill
          sizes="100vw"
          className="object-cover scale-105 blur-[2px] opacity-40 grayscale-[20%] transition-transform duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-emerald-950/75" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-transparent to-blue-950/20 animate-gradient-shift" />
      </div>

      {/* DESKTOP VERSION */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden md:flex relative z-10 w-full px-6 lg:px-10 xl:px-16 pt-8 flex-col h-full overflow-hidden"
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Logo & Title Section */}
          <motion.div
            variants={headerVariants}
            className="flex flex-col items-center text-center mb-2"
          >
            <div className="w-16 h-16 mb-3 relative bg-white/10 backdrop-blur-md p-2 rounded-2xl ring-1 ring-white/20 shadow-2xl transition-transform hover:scale-105 duration-500">
              <Image
                src={siteInfo.logoSrc}
                alt="Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain drop-shadow-lg"
                unoptimized
              />
            </div>
            <p className="mb-1 text-sm font-black uppercase tracking-[0.4em] text-emerald-500/90">
              Portal Resmi
            </p>
            <h1 className="flex flex-col items-center font-black uppercase tracking-tight leading-none max-w-5xl px-2 text-center">
              <span className="text-2xl lg:text-3xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Kementerian Agama Kabupaten Barito Utara
              </span>
            </h1>
            <p className="mt-1 text-slate-400 text-sm max-w-none font-medium px-4 whitespace-nowrap">
              Akses cepat informasi dan layanan keagamaan Kabupaten Barito Utara
              dalam satu pintu.
            </p>
          </motion.div>

          {/* Status & Time Indicator - Desktop */}
          <DesktopClockSection />

          {/* Berita Ticker - Desktop */}
          {portalData?.latestBerita?.length > 0 && (
            <motion.div
              variants={headerVariants}
              className="w-full mt-1 overflow-hidden"
            >
              <div className="relative flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full ring-1 ring-white/10">
                <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full leading-none flex items-center justify-center">
                  Terbaru
                </span>
                <div className="overflow-hidden relative flex-1 flex items-center self-stretch">
                  <div className="animate-marquee whitespace-nowrap flex items-center gap-0 h-full">
                    {[
                      ...portalData.latestBerita,
                      ...portalData.latestBerita,
                    ].map((item, i) => (
                      <React.Fragment key={`${item.slug}-${i}`}>
                        <Link
                          href={`/berita/${item.slug}`}
                          target={isStandalone ? undefined : "_blank"}
                          className="text-slate-300 text-[11px] font-medium hover:text-emerald-400 transition-colors shrink-0 leading-none flex items-center h-full"
                        >
                          {item.title}
                        </Link>
                        <span className="mx-3 text-slate-500/40 flex items-center h-full leading-none">
                          |
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Portal Grid Section */}
          <div className="flex items-center justify-center w-full mt-2 py-2">
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-4 gap-x-5 gap-y-3 w-full"
            >
              {PORTAL_LINKS.map((link) => (
                <motion.div
                  key={link.title}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <Link
                    href={link.href}
                    target={isStandalone ? undefined : "_blank"}
                    rel={isStandalone ? undefined : "noopener noreferrer"}
                    className={`group relative p-4 rounded-3xl transition-all duration-300 flex flex-col items-start text-left h-full ${
                      link.primary
                        ? "bg-emerald-600/20 backdrop-blur-xl ring-1 ring-emerald-500/50 hover:bg-emerald-600/30"
                        : "bg-white/5 backdrop-blur-lg ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 shrink-0 ${
                        link.primary
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-800/50 text-slate-300 group-hover:text-emerald-400"
                      }`}
                    >
                      {link.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {link.title}
                      </h2>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {link.description}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex mt-auto pt-6 w-full justify-end">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          link.primary
                            ? "bg-emerald-500 text-white"
                            : "bg-white/10 text-white group-hover:bg-emerald-500 group-hover:translate-x-1"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>


        </div>

        {/* Footer info */}
        <motion.div
          variants={headerVariants}
          className="text-center opacity-60 hover:opacity-100 transition-opacity pb-4"
        >
          <p className="text-slate-500 text-[10px] font-medium tracking-widest uppercase">
            &copy; {new Date().getFullYear()} {siteInfo.name}
          </p>
        </motion.div>
      </motion.div>

      {/* MOBILE VERSION */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex md:hidden relative z-10 w-full px-5 pt-8 flex-col h-full overflow-hidden"
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Logo & Title Section */}
          <motion.div
            variants={headerVariants}
            className="flex flex-col items-center text-center mb-3"
          >
            <div className="w-16 h-16 mb-2 relative bg-white/10 backdrop-blur-md p-2 rounded-2xl ring-1 ring-white/20 shadow-2xl">
              <Image
                src={siteInfo.logoSrc}
                alt="Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain drop-shadow-lg"
                unoptimized
              />
            </div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/90">
              Portal Resmi
            </p>
            <h1 className="flex flex-col items-center font-black uppercase tracking-tight leading-none px-2">
              <span className="text-lg bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Kementerian Agama
              </span>
              <span className="text-lg bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Kabupaten Barito Utara
              </span>
            </h1>
            <p className="mt-2 text-slate-400 text-[9px] font-medium px-2 leading-relaxed">
              Akses cepat informasi dan layanan keagamaan
              <br />
              Kabupaten Barito Utara dalam satu pintu.
            </p>
          </motion.div>

          {/* Enhanced Status & Time - Mobile */}
          <MobileClockSection />

          {/* Berita Ticker - Mobile */}
          {portalData?.latestBerita?.length > 0 && (
            <motion.div
              variants={headerVariants}
              className="w-full mt-1 overflow-hidden"
            >
              <div className="relative flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full ring-1 ring-white/10">
                <span className="shrink-0 text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full leading-none flex items-center justify-center">
                  Baru
                </span>
                <div className="overflow-hidden relative flex-1 flex items-center self-stretch">
                  <div className="animate-marquee whitespace-nowrap flex items-center gap-0 h-full">
                    {[
                      ...portalData.latestBerita,
                      ...portalData.latestBerita,
                    ].map((item, i) => (
                      <React.Fragment key={`${item.slug}-${i}`}>
                        <Link
                          href={`/berita/${item.slug}`}
                          target={isStandalone ? undefined : "_blank"}
                          className="text-slate-300 text-[10px] font-medium hover:text-emerald-400 transition-colors shrink-0 leading-none flex items-center h-full"
                        >
                          {item.title}
                        </Link>
                        <span className="mx-2.5 text-slate-500/40 flex items-center h-full leading-none">
                          |
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Portal Grid Section */}
          <div className="flex items-center justify-center w-full mt-2 py-1">
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-3 w-full"
            >
              {PORTAL_LINKS.map((link) => (
                <motion.div
                  key={link.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full"
                >
                  <Link
                    href={link.href}
                    target={isStandalone ? undefined : "_blank"}
                    rel={isStandalone ? undefined : "noopener noreferrer"}
                    className={`group relative p-5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center w-full h-full ${
                      link.primary
                        ? "bg-emerald-600/20 backdrop-blur-xl ring-1 ring-emerald-500/50"
                        : "bg-white/5 backdrop-blur-lg ring-1 ring-white/10"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 shrink-0 ${
                        link.primary
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-800/50 text-slate-300"
                      }`}
                    >
                      {link.icon}
                    </div>
                    <h2 className="text-[11px] font-bold text-white line-clamp-1">
                      {link.title}
                    </h2>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>


        </div>

        {/* Footer info */}
        <motion.div
          variants={headerVariants}
          className="text-center opacity-60 pb-4"
        >
          <p className="text-slate-500 text-[6px] font-medium tracking-widest uppercase">
            &copy; {new Date().getFullYear()} {siteInfo.name}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
