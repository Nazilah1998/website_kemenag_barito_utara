"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DesktopClockSection, MobileClockSection } from "./ClockSection";
import HeroBackground from "./HeroBackground";
import PrayerScheduleWidget from "./PrayerScheduleWidget";
import { useSiteSettings } from "@/context/SettingsContext";
import { 
  Globe, FolderOpen, Lightbulb, Info, MessageSquareWarning, ShieldCheck, ClipboardList, Headset, ChevronRight, X,
  LogIn, UserPlus, FileSearch, Navigation, BookOpen, CalendarDays,
  Users, Archive, MailOpen, FileCheck, Database, Calculator,
  Newspaper, Image as ImageIcon, FileText,
  ClipboardCheck, LineChart, Map, PlaySquare, Megaphone, Siren 
} from "lucide-react";

const PTSP_MENUS = [
  {
    title: "Masuk PTSP Si ATAK",
    href: "https://ptsp.kemenag-baritoutara.com/",
    icon: <LogIn className="w-5 h-5 text-blue-400" strokeWidth={2} />,
  },
  {
    title: "Buat Akun Pemohon",
    href: "https://ptsp.kemenag-baritoutara.com/login/pemohon",
    icon: <UserPlus className="w-5 h-5 text-emerald-400" strokeWidth={2} />,
  },
  {
    title: "Katalog Layanan PTSP Si ATAK",
    href: "https://ptsp.kemenag-baritoutara.com/layanan",
    icon: <FileSearch className="w-5 h-5 text-amber-400" strokeWidth={2} />,
  },
  {
    title: "Lacak Layanan",
    href: "https://ptsp.kemenag-baritoutara.com/track",
    icon: <Navigation className="w-5 h-5 text-purple-400" strokeWidth={2} />,
  },
  {
    title: "Buku Tamu",
    href: "https://ptsp.kemenag-baritoutara.com/buku-tamu",
    icon: <BookOpen className="w-5 h-5 text-rose-400" strokeWidth={2} />,
  },
  {
    title: "Janji Temu",
    href: "https://ptsp.kemenag-baritoutara.com/janji-temu",
    icon: <CalendarDays className="w-5 h-5 text-cyan-400" strokeWidth={2} />,
  },
];

const INOVASI_MENUS = [
  {
    title: "Pusat Layanan Inklusif",
    href: "https://inklusi.kemenag-baritoutara.com/",
    icon: <Users className="w-5 h-5 text-blue-400" strokeWidth={2} />,
  },
  {
    title: "Layanan PTSP Si ATAK",
    href: "https://ptsp.kemenag-baritoutara.com/",
    icon: <FolderOpen className="w-5 h-5 text-blue-400" strokeWidth={2} />,
  },
  {
    title: "SI BETANG",
    href: "https://arsip.kemenag-baritoutara.com/login",
    icon: <Archive className="w-5 h-5 text-amber-400" strokeWidth={2} />,
  },
  {
    title: "SI MANDAU",
    href: "https://surat.kemenag-baritoutara.com/login",
    icon: <MailOpen className="w-5 h-5 text-emerald-400" strokeWidth={2} />,
  },
  {
    title: "E-SOP Digital",
    href: "https://sop.kemenag-baritoutara.com/",
    icon: <FileCheck className="w-5 h-5 text-cyan-400" strokeWidth={2} />,
  },
  {
    title: "PUSDATIN",
    href: "https://pusdatin.kemenag-baritoutara.com/",
    icon: <Database className="w-5 h-5 text-purple-400" strokeWidth={2} />,
  },
  {
    title: "Kalkulator Zakat & Waris",
    href: "/layanan/kalkulator",
    icon: <Calculator className="w-5 h-5 text-emerald-500" strokeWidth={2} />,
  },
];

const INFORMASI_MENUS = [
  {
    title: "Berita",
    href: "https://baritoutara.kemenag.go.id/berita",
    icon: <Newspaper className="w-5 h-5 text-amber-400" strokeWidth={2} />,
  },
  {
    title: "Galeri",
    href: "https://baritoutara.kemenag.go.id/galeri",
    icon: <ImageIcon className="w-5 h-5 text-fuchsia-400" strokeWidth={2} />,
  },
  {
    title: "Dokumen Laporan",
    href: "https://baritoutara.kemenag.go.id/laporan",
    icon: <FileText className="w-5 h-5 text-cyan-400" strokeWidth={2} />,
  },
  {
    title: "Video YouTube",
    href: "https://baritoutara.kemenag.go.id/video",
    icon: <PlaySquare className="w-5 h-5 text-rose-400" strokeWidth={2} />,
  },
];

const SURVEY_MENUS = [
  {
    title: "SKM KEMENPAN RB",
    href: "https://skm.go.id/share/instansi/a461fae7-6b20-40f2-b82d-238c5adf4c01/2",
    icon: <ClipboardCheck className="w-5 h-5 text-emerald-400" strokeWidth={2} />,
  },
  {
    title: "SI ARUS",
    href: "https://survei.kemenag-baritoutara.com",
    icon: <LineChart className="w-5 h-5 text-blue-400" strokeWidth={2} />,
  },
];

const ZONA_MENUS = [
  {
    title: "Masuk Zona Integritas",
    href: "https://baritoutara.kemenag.go.id/zona-integritas",
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" strokeWidth={2} />,
  },
  {
    title: "Berita Zona Integritas",
    href: "https://baritoutara.kemenag.go.id/zona-integritas/berita-zona-integritas",
    icon: <Newspaper className="w-5 h-5 text-amber-400" strokeWidth={2} />,
  },
  {
    title: "Area Perubahan - ZI",
    href: "https://baritoutara.kemenag.go.id/zona-integritas/area-perubahan-zi",
    icon: <Map className="w-5 h-5 text-blue-400" strokeWidth={2} />,
  },
  {
    title: "Video Pembangunan - ZI",
    href: "https://baritoutara.kemenag.go.id/zona-integritas/video-pembangunan-zi",
    icon: <PlaySquare className="w-5 h-5 text-rose-400" strokeWidth={2} />,
  },
];

const PENGADUAN_MENUS = [
  {
    title: "E-Pengaduan",
    href: "https://ptsp.kemenag-baritoutara.com/e-pengaduan",
    icon: <MessageSquareWarning className="w-5 h-5 text-blue-400" strokeWidth={2} />,
  },
  {
    title: "SP4N-LAPOR!",
    href: "https://www.lapor.go.id/",
    icon: <Megaphone className="w-5 h-5 text-red-400" strokeWidth={2} />,
  },
  {
    title: "Whistle Blower System",
    href: "https://simdumas.kemenag.go.id/",
    icon: <Siren className="w-5 h-5 text-emerald-400" strokeWidth={2} />,
  },
];

const PORTAL_LINKS = [
  {
    id: "website_utama",
    title: "Website Utama",
    description: "Informasi publik, berita, dan layanan keagamaan terlengkap.",
    href: "/beranda",
    icon: <Globe className="w-7 h-7" strokeWidth={1.5} />,
    primary: true,
  },
  {
    id: "ptsp",
    title: "Layanan PTSP Si ATAK",
    description: "Pusat Layanan Terpadu Satu Pintu untuk segala urusan administrasi.",
    href: "#",
    icon: <FolderOpen className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    id: "inovasi",
    title: "Inovasi Kemenag",
    description: "Kumpulan aplikasi dan inovasi layanan digital Kemenag Barito Utara.",
    href: "#",
    icon: <Lightbulb className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    id: "informasi",
    title: "Informasi Publik",
    description: "Kumpulan berita, galeri kegiatan, dan laporan instansi.",
    href: "#",
    icon: <Info className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    id: "pengaduan",
    title: "Layanan Pengaduan",
    description: "Saluran penyampaian pengaduan dan pelaporan masyarakat.",
    href: "#",
    icon: <MessageSquareWarning className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    id: "zona",
    title: "Zona Integritas",
    description: "Komitmen kami dalam mewujudkan birokrasi yang bersih dan melayani.",
    href: "#",
    icon: <ShieldCheck className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    id: "survey",
    title: "Layanan Survey",
    description: "Bantu kami meningkatkan kualitas layanan dengan mengisi survey.",
    href: "#",
    icon: <ClipboardList className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    title: "Kontak Kami",
    description: "Hubungi kami untuk informasi lebih lanjut dan bantuan.",
    href: "/kontak",
    icon: <Headset className="w-7 h-7" strokeWidth={1.5} />,
  },
];

export default function PortalPage() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [portalData, setPortalData] = useState(null);
  const [portalError, setPortalError] = useState(false);
  const [portalLoading, setPortalLoading] = useState(true);
  const [isPtspModalOpen, setIsPtspModalOpen] = useState(false);
  const [isInovasiModalOpen, setIsInovasiModalOpen] = useState(false);
  const [isInformasiModalOpen, setIsInformasiModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [isZonaModalOpen, setIsZonaModalOpen] = useState(false);
  const [isPengaduanModalOpen, setIsPengaduanModalOpen] = useState(false);
  const { siteInfo } = useSiteSettings();

  useEffect(() => {
    fetch("/api/portal")
      .then((res) => res.json())
      .then((data) => {
        if (data?.beritaCount !== undefined) setPortalData(data);
        else setPortalError(true);
      })
      .catch(() => {
        setPortalError(true);
      })
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
      detectPwa();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div 
      className="relative min-h-screen flex flex-col bg-slate-900 selection:bg-emerald-500/30 overflow-x-hidden"
      onContextMenu={(e) => {
        if (siteInfo?.fitur_anti_copas) {
          e.preventDefault();
        }
      }}
    >
      <HeroBackground />
      {/* SHARED CENTERED WRAPPER */}
      <div className="flex-1 flex flex-col justify-start md:justify-center w-full relative z-10 pt-6 pb-4 md:py-8">
        {/* DESKTOP VERSION */}
        <div className="animate-fade-in hidden md:flex w-full px-6 lg:px-10 xl:px-16 flex-col">
          <div className="flex flex-col items-center justify-center">
            {/* Logo, Title & Right Image Section - Desktop */}
            <div
              className="animate-fade-in flex flex-row items-center justify-center w-full max-w-5xl gap-4 md:gap-8 mb-2 mx-auto"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Left Logo */}
              <div className="w-20 h-20 md:w-24 md:h-24 relative transition-transform hover:scale-110 duration-500 shrink-0">
                <Image
                  src={siteInfo.logoSrc}
                  alt="Logo Kemenag"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  unoptimized
                  priority
                />
              </div>

              {/* Title Section */}
              <div className="flex flex-col items-center text-center flex-1">
                <h1 className="flex flex-col items-center font-black uppercase tracking-tight leading-none px-2 text-center mb-4">
                  <span className="text-2xl lg:text-3xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    {siteInfo.logoTitleLine1}
                  </span>
                  <span className="text-2xl lg:text-3xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mt-1">
                    {siteInfo.logoTitleLine2}
                  </span>
                </h1>

                {/* Hapakat Logo & Text */}
                <div className="flex flex-col items-center mt-2">
                  <Image
                    src="/assets/branding/hapakat.png"
                    alt="Hapakat"
                    width={180}
                    height={40}
                    className="object-contain drop-shadow-md mb-3 h-8 lg:h-10 w-auto"
                    style={{ width: "auto" }}
                    unoptimized
                  />
                  <div className="text-[11px] lg:text-xs font-bold text-slate-300 tracking-wide text-center leading-relaxed">
                    <p>
                      <span className="text-emerald-400 text-[13px] lg:text-sm">
                        H
                      </span>
                      armonis,{" "}
                      <span className="text-emerald-400 text-[13px] lg:text-sm">
                        A
                      </span>
                      manah,{" "}
                      <span className="text-emerald-400 text-[13px] lg:text-sm">
                        P
                      </span>
                      rofesional,{" "}
                      <span className="text-emerald-400 text-[13px] lg:text-sm">
                        A
                      </span>
                      kuntabel,{" "}
                      <span className="text-emerald-400 text-[13px] lg:text-sm">
                        K
                      </span>
                      reatif,{" "}
                      <span className="text-emerald-400 text-[13px] lg:text-sm">
                        A
                      </span>
                      dil dan{" "}
                      <span className="text-emerald-400 text-[13px] lg:text-sm">
                        T
                      </span>
                      ransparan
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Logo */}
              <div className="w-28 h-28 md:w-36 md:h-36 relative transition-transform hover:scale-110 duration-500 shrink-0">
                <Image
                  src="/assets/branding/atak-portal.png"
                  alt="Portal Atak"
                  width={144}
                  height={144}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  unoptimized
                  priority
                />
              </div>
            </div>

            {/* Status & Time Indicator - Desktop */}
            <DesktopClockSection />
            <PrayerScheduleWidget />

            {/* Berita Ticker - Desktop */}
            {portalError ? (
              <div
                className="animate-fade-in w-full mt-1 overflow-hidden flex justify-center"
                style={{ animationDelay: "0.15s" }}
              >
                <span className="text-[10px] text-rose-400/80 font-medium bg-rose-500/10 px-3 py-1 rounded-full ring-1 ring-rose-500/20">
                  Gagal memuat berita terbaru
                </span>
              </div>
            ) : (
              portalData?.latestBerita?.length > 0 && (
                <div
                  className="animate-fade-in w-full mt-1 overflow-hidden"
                  style={{ animationDelay: "0.15s" }}
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
                </div>
              )
            )}

            {/* Portal Grid Section */}
            <div className="flex items-center justify-center w-full mt-2 py-2">
              <div className="grid grid-cols-4 gap-x-5 gap-y-3 w-full">
                {PORTAL_LINKS.map((link, idx) => (
                  <div
                    key={link.title}
                    className="animate-fade-in-up h-full"
                    style={{ animationDelay: `${0.2 + idx * 0.08}s` }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        if (link.id === "ptsp") {
                          e.preventDefault();
                          setIsPtspModalOpen(true);
                        } else if (link.id === "inovasi") {
                          e.preventDefault();
                          setIsInovasiModalOpen(true);
                        } else if (link.id === "informasi") {
                          e.preventDefault();
                          setIsInformasiModalOpen(true);
                        } else if (link.id === "survey") {
                          e.preventDefault();
                          setIsSurveyModalOpen(true);
                        } else if (link.id === "zona") {
                          e.preventDefault();
                          setIsZonaModalOpen(true);
                        } else if (link.id === "pengaduan") {
                          e.preventDefault();
                          setIsPengaduanModalOpen(true);
                        }
                      }}
                      target={
                        link.href.startsWith("http") && !link.id
                          ? "_blank"
                          : isStandalone
                            ? undefined
                            : "_blank"
                      }
                      rel={
                        link.href.startsWith("http") && !link.id
                          ? "noopener noreferrer"
                          : isStandalone
                            ? undefined
                            : "noopener noreferrer"
                      }
                      className={`group relative p-5 lg:p-6 rounded-[2rem] transition-all duration-500 flex flex-col items-start text-left h-full hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] overflow-hidden ${
                        link.primary
                          ? "bg-gradient-to-br from-emerald-900/60 to-emerald-800/20 backdrop-blur-3xl border border-emerald-500/30 hover:border-emerald-400/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                          : "bg-[#0f172a]/60 backdrop-blur-3xl border border-white/5 hover:bg-[#1e293b]/80 hover:border-white/10 shadow-xl"
                      }`}
                    >
                      {/* Subtly glowing background element */}
                      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -z-10 rounded-full transition-opacity duration-500 ${link.primary ? "bg-emerald-500/20 group-hover:bg-emerald-500/30" : "bg-white/5 group-hover:bg-white/10"}`} />
                      
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shrink-0 shadow-lg ${
                          link.primary
                            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/20"
                            : "bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {link.icon}
                      </div>
                      <div className="flex flex-col items-start relative z-10">
                        <h2 className="text-[17px] lg:text-[19px] font-black text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1 tracking-wide">
                          {link.title}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">
                          {link.description}
                        </p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex mt-auto pt-6 w-full justify-end relative z-10">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                            link.primary
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 group-hover:translate-x-1"
                              : "bg-white/10 text-white group-hover:bg-emerald-500 group-hover:translate-x-1 group-hover:shadow-lg group-hover:shadow-emerald-500/30"
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" strokeWidth={3} />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>{" "}
        {/* MOBILE VERSION */}
        <div className="animate-fade-in flex md:hidden w-full px-5 flex-col pb-2">
          <div className="flex flex-col items-center justify-center">
            {/* Logo, Title & Right Image Section - Mobile */}
            <div
              className="animate-fade-in flex flex-row items-center justify-between w-full mb-3 gap-2"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Left Logo */}
              <div className="w-20 sm:w-24 flex justify-center items-start shrink-0">
                <div className="w-10 h-10 relative shrink-0 self-start mt-1 transition-transform hover:scale-105 duration-500">
                  <Image
                    src={siteInfo.logoSrc}
                    alt="Logo Kemenag"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain drop-shadow-xl"
                    unoptimized
                    priority
                  />
                </div>
              </div>

              {/* Title Section */}
              <div className="flex flex-col items-center text-center flex-1 min-w-0">
                <h1 className="flex flex-col items-center font-black uppercase tracking-tight leading-none px-1 mb-2">
                  <span className="text-[15px] sm:text-lg bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent text-center leading-tight">
                    {siteInfo.logoTitleLine1}
                  </span>
                  <span className="text-[12px] sm:text-[15px] bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent text-center leading-tight mt-0.5">
                    {siteInfo.logoTitleLine2}
                  </span>
                </h1>

                {/* Hapakat Logo & Text */}
                <div className="flex flex-col items-center mt-1">
                  <Image
                    src="/assets/branding/hapakat.png"
                    alt="Hapakat"
                    width={120}
                    height={28}
                    className="object-contain drop-shadow-md mb-2 h-7 lg:h-9 w-auto"
                    style={{ width: "auto" }}
                    unoptimized
                  />
                  <div className="w-full overflow-hidden text-center">
                    <p
                      className="whitespace-nowrap font-bold text-slate-300 tracking-wide text-center"
                      style={{ fontSize: "clamp(4px, 1.45vw, 9px)" }}
                    >
                      <span
                        className="text-emerald-400"
                        style={{ fontSize: "clamp(5px, 1.7vw, 11px)" }}
                      >
                        H
                      </span>
                      armonis,{" "}
                      <span
                        className="text-emerald-400"
                        style={{ fontSize: "clamp(5px, 1.7vw, 11px)" }}
                      >
                        A
                      </span>
                      manah,{" "}
                      <span
                        className="text-emerald-400"
                        style={{ fontSize: "clamp(5px, 1.7vw, 11px)" }}
                      >
                        P
                      </span>
                      rofesional,{" "}
                      <span
                        className="text-emerald-400"
                        style={{ fontSize: "clamp(5px, 1.7vw, 11px)" }}
                      >
                        A
                      </span>
                      kuntabel,{" "}
                      <span
                        className="text-emerald-400"
                        style={{ fontSize: "clamp(5px, 1.7vw, 11px)" }}
                      >
                        K
                      </span>
                      reatif,{" "}
                      <span
                        className="text-emerald-400"
                        style={{ fontSize: "clamp(5px, 1.7vw, 11px)" }}
                      >
                        A
                      </span>
                      dil dan{" "}
                      <span
                        className="text-emerald-400"
                        style={{ fontSize: "clamp(5px, 1.7vw, 11px)" }}
                      >
                        T
                      </span>
                      ransparan
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Logo */}
              <div className="w-20 sm:w-24 flex justify-end items-start shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 relative shrink-0 self-start mt-1 transition-transform hover:scale-105 duration-500">
                  <Image
                    src="/assets/branding/atak-portal.png"
                    alt="Portal Atak"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain drop-shadow-xl"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Status & Time - Mobile */}
            <MobileClockSection />
            <div className="md:hidden">
              <PrayerScheduleWidget />
            </div>

            {/* Berita Ticker - Mobile */}
            {portalError ? (
              <div
                className="animate-fade-in w-full mt-1 overflow-hidden flex justify-center"
                style={{ animationDelay: "0.15s" }}
              >
                <span className="text-[9px] text-rose-400/80 font-medium bg-rose-500/10 px-3 py-1 rounded-full ring-1 ring-rose-500/20">
                  Gagal memuat berita terbaru
                </span>
              </div>
            ) : (
              portalData?.latestBerita?.length > 0 && (
                <div
                  className="animate-fade-in w-full mt-1 overflow-hidden"
                  style={{ animationDelay: "0.15s" }}
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
                </div>
              )
            )}

            {/* Portal Grid Section */}
            <div className="flex items-center justify-center w-full mt-2 py-1">
              <div className="grid grid-cols-2 gap-3 w-full">
                {PORTAL_LINKS.map((link, idx) => (
                  <div
                    key={link.title}
                    className="animate-fade-in-up w-full"
                    style={{ animationDelay: `${0.2 + idx * 0.08}s` }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        if (link.id === "ptsp") {
                          e.preventDefault();
                          setIsPtspModalOpen(true);
                        } else if (link.id === "inovasi") {
                          e.preventDefault();
                          setIsInovasiModalOpen(true);
                        } else if (link.id === "informasi") {
                          e.preventDefault();
                          setIsInformasiModalOpen(true);
                        } else if (link.id === "survey") {
                          e.preventDefault();
                          setIsSurveyModalOpen(true);
                        } else if (link.id === "zona") {
                          e.preventDefault();
                          setIsZonaModalOpen(true);
                        } else if (link.id === "pengaduan") {
                          e.preventDefault();
                          setIsPengaduanModalOpen(true);
                        }
                      }}
                      target={
                        link.href.startsWith("http") && !link.id
                          ? "_blank"
                          : isStandalone
                            ? undefined
                            : "_blank"
                      }
                      rel={
                        link.href.startsWith("http") && !link.id
                          ? "noopener noreferrer"
                          : isStandalone
                            ? undefined
                            : "noopener noreferrer"
                      }
                      className={`group relative p-4 sm:p-5 rounded-3xl transition-all duration-300 flex flex-col items-center text-center w-full h-full hover:scale-[1.03] active:scale-[0.97] overflow-hidden ${
                        link.primary
                          ? "bg-gradient-to-br from-emerald-900/60 to-emerald-800/20 backdrop-blur-3xl border border-emerald-500/30"
                          : "bg-[#0f172a]/60 backdrop-blur-3xl border border-white/5"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-[1rem] flex items-center justify-center mb-3 shrink-0 shadow-lg ${
                          link.primary
                            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/20"
                            : "bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300"
                        }`}
                      >
                        {link.icon}
                      </div>
                      <h2 className="text-xs sm:text-[13px] font-bold text-white line-clamp-2 leading-tight">
                        {link.title}
                      </h2>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* PTSP Modal */}
        {isPtspModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsPtspModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900/90 border border-emerald-500/20 rounded-3xl shadow-2xl shadow-emerald-950/40 overflow-hidden animate-fade-in-up backdrop-blur-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                    <FolderOpen className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base sm:text-lg tracking-tight">Layanan PTSP Si ATAK</h3>
                    <p className="text-[11px] font-medium text-slate-400">Pusat Layanan Terpadu Satu Pintu</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPtspModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto hide-scrollbar">
                <div className="flex flex-col gap-2.5">
                  {PTSP_MENUS.map((menu, idx) => (
                    <Link
                      key={idx}
                      href={menu.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsPtspModalOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/20 group-hover:scale-105 flex items-center justify-center transition-all duration-300 shrink-0">
                        {menu.icon}
                      </div>
                      <span className="flex-1 text-slate-200 font-semibold text-sm group-hover:text-emerald-300 transition-colors">
                        {menu.title}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-emerald-500/20 flex items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all duration-300" strokeWidth={2.5} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Inovasi Modal */}
        {isInovasiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsInovasiModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900/90 border border-amber-500/20 rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden animate-fade-in-up backdrop-blur-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
                    <Lightbulb className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base sm:text-lg tracking-tight">Inovasi Kemenag</h3>
                    <p className="text-[11px] font-medium text-slate-400">Aplikasi & Layanan Digital Terintegrasi</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsInovasiModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto hide-scrollbar">
                <div className="flex flex-col gap-2.5">
                  {INOVASI_MENUS.map((menu, idx) => (
                    <Link
                      key={idx}
                      href={menu.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsInovasiModalOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 transition-all duration-300 group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-white/5 group-hover:border-amber-500/30 group-hover:bg-amber-500/20 group-hover:scale-105 flex items-center justify-center transition-all duration-300 shrink-0">
                        {menu.icon}
                      </div>
                      <span className="flex-1 text-slate-200 font-semibold text-sm group-hover:text-amber-300 transition-colors">
                        {menu.title}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-amber-500/20 flex items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all duration-300" strokeWidth={2.5} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Informasi Publik Modal */}
        {isInformasiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsInformasiModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900/90 border border-fuchsia-500/20 rounded-3xl shadow-2xl shadow-fuchsia-950/40 overflow-hidden animate-fade-in-up backdrop-blur-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-900 via-fuchsia-950/30 to-slate-900 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center shadow-inner">
                    <Info className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base sm:text-lg tracking-tight">Informasi Publik</h3>
                    <p className="text-[11px] font-medium text-slate-400">Portal Berita, Galeri & Laporan</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsInformasiModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto hide-scrollbar">
                <div className="flex flex-col gap-2.5">
                  {INFORMASI_MENUS.map((menu, idx) => (
                    <Link
                      key={idx}
                      href={menu.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsInformasiModalOpen(false)}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-fuchsia-500/10 border border-white/5 hover:border-fuchsia-500/30 transition-all duration-300 group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-white/5 group-hover:border-fuchsia-500/30 group-hover:bg-fuchsia-500/20 group-hover:scale-105 flex items-center justify-center transition-all duration-300 shrink-0">
                        {menu.icon}
                      </div>
                      <span className="flex-1 text-slate-200 font-semibold text-sm group-hover:text-fuchsia-300 transition-colors">
                        {menu.title}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-fuchsia-500/20 flex items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-fuchsia-300 group-hover:translate-x-0.5 transition-all duration-300" strokeWidth={2.5} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Layanan Survey Modal */}
        {isSurveyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsSurveyModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900/90 border border-purple-500/20 rounded-3xl shadow-2xl shadow-purple-950/40 overflow-hidden animate-fade-in-up backdrop-blur-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-inner">
                    <ClipboardList className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base sm:text-lg tracking-tight">Layanan Survey</h3>
                    <p className="text-[11px] font-medium text-slate-400">Survei Kepuasan & Indeks Pelayanan</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSurveyModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto hide-scrollbar">
                <div className="flex flex-col gap-2.5">
                  {SURVEY_MENUS.map((menu, idx) => (
                    <Link
                      key={idx}
                      href={menu.href}
                      target={menu.href === "#" ? undefined : "_blank"}
                      rel={
                        menu.href === "#" ? undefined : "noopener noreferrer"
                      }
                      onClick={(e) => {
                        if (menu.href === "#") e.preventDefault();
                        setIsSurveyModalOpen(false);
                      }}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 transition-all duration-300 group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-white/5 group-hover:border-purple-500/30 group-hover:bg-purple-500/20 group-hover:scale-105 flex items-center justify-center transition-all duration-300 shrink-0">
                        {menu.icon}
                      </div>
                      <span className="flex-1 text-slate-200 font-semibold text-sm group-hover:text-purple-300 transition-colors">
                        {menu.title}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-purple-500/20 flex items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all duration-300" strokeWidth={2.5} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Zona Integritas Modal */}
        {isZonaModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsZonaModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900/90 border border-emerald-500/20 rounded-3xl shadow-2xl shadow-emerald-950/40 overflow-hidden animate-fade-in-up backdrop-blur-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base sm:text-lg tracking-tight">Zona Integritas</h3>
                    <p className="text-[11px] font-medium text-slate-400">Pembangunan WBK & WBBM</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsZonaModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto hide-scrollbar">
                <div className="flex flex-col gap-2.5">
                  {ZONA_MENUS.map((menu, idx) => (
                    <Link
                      key={idx}
                      href={menu.href}
                      target={menu.href === "#" ? undefined : "_blank"}
                      rel={
                        menu.href === "#" ? undefined : "noopener noreferrer"
                      }
                      onClick={(e) => {
                        if (menu.href === "#") e.preventDefault();
                        setIsZonaModalOpen(false);
                      }}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/20 group-hover:scale-105 flex items-center justify-center transition-all duration-300 shrink-0">
                        {menu.icon}
                      </div>
                      <span className="flex-1 text-slate-200 font-semibold text-sm group-hover:text-emerald-300 transition-colors">
                        {menu.title}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-emerald-500/20 flex items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all duration-300" strokeWidth={2.5} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Layanan Pengaduan Modal */}
        {isPengaduanModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsPengaduanModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900/90 border border-cyan-500/20 rounded-3xl shadow-2xl shadow-cyan-950/40 overflow-hidden animate-fade-in-up backdrop-blur-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-inner">
                    <Headset className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base sm:text-lg tracking-tight">Layanan Pengaduan</h3>
                    <p className="text-[11px] font-medium text-slate-400">Saluran Aspirasi & Pengaduan Masyarakat</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPengaduanModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto hide-scrollbar">
                <div className="flex flex-col gap-2.5">
                  {PENGADUAN_MENUS.map((menu, idx) => (
                    <Link
                      key={idx}
                      href={menu.href}
                      target={menu.href === "#" ? undefined : "_blank"}
                      rel={
                        menu.href === "#" ? undefined : "noopener noreferrer"
                      }
                      onClick={(e) => {
                        if (menu.href === "#") e.preventDefault();
                        setIsPengaduanModalOpen(false);
                      }}
                      className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-white/5 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/20 group-hover:scale-105 flex items-center justify-center transition-all duration-300 shrink-0">
                        {menu.icon}
                      </div>
                      <span className="flex-1 text-slate-200 font-semibold text-sm group-hover:text-cyan-300 transition-colors">
                        {menu.title}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-cyan-500/20 flex items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all duration-300" strokeWidth={2.5} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shared Footer info */}
      <div
        className="animate-fade-in text-center opacity-60 hover:opacity-100 transition-opacity pb-1 sm:pb-2 pt-0.5 w-full"
        style={{ animationDelay: "0.3s" }}
      >
        <p className="text-slate-500 text-[8px] md:text-[10px] font-medium tracking-widest uppercase">
          &copy; {new Date().getFullYear()} {siteInfo.name}
        </p>
      </div>
    </div>
  );
}
