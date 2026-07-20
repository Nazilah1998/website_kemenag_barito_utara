"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DesktopClockSection, MobileClockSection } from "./ClockSection";
import HeroBackground from "./HeroBackground";
import PrayerScheduleWidget from "./PrayerScheduleWidget";
import { useSiteSettings } from "@/context/SettingsContext";
import { 
  Globe, FolderOpen, Lightbulb, Info, MessageSquareWarning, ShieldCheck, ClipboardList, Headset, ChevronRight,
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsPtspModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <h3 className="text-white font-bold text-lg">Layanan PTSP Si ATAK</h3>
                </div>
                <button
                  onClick={() => setIsPtspModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-3">
                  {PTSP_MENUS.map((menu, idx) => (
                    <Link
                      key={idx}
                      href={menu.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsPtspModalOpen(false)}
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-emerald-900/40 hover:to-emerald-800/10 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgb(16,185,129,0.15)]"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-800/80 group-hover:bg-gradient-to-br group-hover:from-emerald-400 group-hover:to-emerald-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-emerald-500/30 group-hover:rotate-3 shrink-0">
                        {menu.icon}
                      </div>
                      <span className="flex-1 text-slate-200 font-bold text-[14.5px] group-hover:text-white transition-colors tracking-wide">
                        {menu.title}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" strokeWidth={2.5} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Inovasi Modal */}
        {isInovasiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsInovasiModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg">
                    Inovasi Kemenag
                  </h3>
                </div>
                <button
                  onClick={() => setIsInovasiModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-3">
                  {INOVASI_MENUS.map((menu, idx) => (
                    <Link
                      key={idx}
                      href={menu.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsInovasiModalOpen(false)}
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-amber-900/40 hover:to-amber-800/10 border border-white/5 hover:border-amber-500/30 transition-all duration-300 group shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgb(245,158,11,0.15)]"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-800/80 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-amber-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-amber-500/30 group-hover:rotate-3 shrink-0">
                        {menu.icon}
                      </div>
                      <span className="flex-1 text-slate-200 font-bold text-[14.5px] group-hover:text-white transition-colors tracking-wide">
                        {menu.title}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" strokeWidth={2.5} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Informasi Publik Modal */}
        {isInformasiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsInformasiModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg">
                    Informasi Publik
                  </h3>
                </div>
                <button
                  onClick={() => setIsInformasiModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-3">
                  {INFORMASI_MENUS.map((menu, idx) => (
                    <Link
                      key={idx}
                      href={menu.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsInformasiModalOpen(false)}
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-fuchsia-900/40 hover:to-fuchsia-800/10 border border-white/5 hover:border-fuchsia-500/30 transition-all duration-300 group shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgb(217,70,239,0.15)]"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-800/80 group-hover:bg-gradient-to-br group-hover:from-fuchsia-400 group-hover:to-fuchsia-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-fuchsia-500/30 group-hover:rotate-3 shrink-0">
                        {menu.icon}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-slate-200 font-bold text-[14.5px] group-hover:text-white transition-colors tracking-wide">
                          {menu.title}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" strokeWidth={2.5} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Layanan Survey Modal */}
        {isSurveyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsSurveyModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <h3 className="text-white font-bold text-lg">
                    Layanan Survey
                  </h3>
                </div>
                <button
                  onClick={() => setIsSurveyModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-3">
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
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-purple-800/10 border border-white/5 hover:border-purple-500/30 transition-all duration-300 group shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgb(168,85,247,0.15)]"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-800/80 group-hover:bg-gradient-to-br group-hover:from-purple-400 group-hover:to-purple-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-purple-500/30 group-hover:rotate-3 shrink-0">
                        {menu.icon}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-slate-200 font-bold text-[14.5px] group-hover:text-white transition-colors tracking-wide">
                          {menu.title}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" strokeWidth={2.5} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Zona Integritas Modal */}
        {isZonaModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsZonaModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <h3 className="text-white font-bold text-lg">
                    Zona Integritas
                  </h3>
                </div>
                <button
                  onClick={() => setIsZonaModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-3">
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
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-emerald-900/40 hover:to-emerald-800/10 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgb(16,185,129,0.15)]"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-800/80 group-hover:bg-gradient-to-br group-hover:from-emerald-400 group-hover:to-emerald-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-emerald-500/30 group-hover:rotate-3 shrink-0">
                        {menu.icon}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-slate-200 font-bold text-[14.5px] group-hover:text-white transition-colors tracking-wide">
                          {menu.title}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" strokeWidth={2.5} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Layanan Pengaduan Modal */}
        {isPengaduanModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
            {/* Backdrop Click Area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsPengaduanModalOpen(false)}
            ></div>

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg">
                    Layanan Pengaduan
                  </h3>
                </div>
                <button
                  onClick={() => setIsPengaduanModalOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-3">
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
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-cyan-900/40 hover:to-cyan-800/10 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgb(6,182,212,0.15)]"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-800/80 group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-cyan-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-cyan-500/30 group-hover:rotate-3 shrink-0">
                        {menu.icon}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-slate-200 font-bold text-[14.5px] group-hover:text-white transition-colors tracking-wide">
                          {menu.title}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" strokeWidth={2.5} />
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
