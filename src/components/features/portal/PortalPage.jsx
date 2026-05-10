"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteInfo } from "@/data/site";
import { Clock, Calendar, ShieldCheck, ShieldAlert } from "lucide-react";

const PORTAL_LINKS = [
  {
    title: "Website Utama",
    description: "Informasi publik, berita, dan layanan keagamaan terlengkap.",
    href: "/beranda",
    icon: (
      <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    primary: true,
  },
  {
    title: "Layanan PTSP",
    description: "Pusat Layanan Terpadu Satu Pintu untuk segala urusan administrasi.",
    href: "https://ptsp.kemenag-baritoutara.com/",
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Berita Terkini",
    description: "Update informasi dan kegiatan terbaru dari Kemenag Barito Utara.",
    href: "/berita",
    icon: (
      <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    title: "Survey Layanan",
    description: "Bantu kami meningkatkan kualitas layanan dengan mengisi survey.",
    href: "/survey",
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Zona Integritas",
    description: "Komitmen kami dalam mewujudkan birokrasi yang bersih dan melayani.",
    href: "/zona-integritas",
    icon: (
      <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 8.9c.228.033.445.133.615.285l2.772 2.443a.5.5 0 010 .744l-2.772 2.443a1.056 1.056 0 01-.615.285 3.323 3.323 0 00-6.013 3.116 3.323 3.323 0 006.013 3.116c.228-.033.445-.133.615-.285l2.772-2.443a.5.5 0 010-.744l-2.772-2.443a1.056 1.056 0 01.615-.285 3.323 3.323 0 006.013-3.116 3.323 3.323 0 00-6.013-3.116z" />
      </svg>
    ),
  },
  {
    title: "Kontak Kami",
    description: "Hubungi kami untuk informasi lebih lanjut dan bantuan.",
    href: "/kontak",
    icon: (
      <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function PortalPage() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, []);

  const getStatus = () => {
    const day = time.getDay();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const currentTime = hour * 100 + minute;

    // Senin - Kamis: 07:30 - 16:00
    // Jumat: 07:30 - 16:30
    // Sabtu - Minggu: Tutup
    let isOpen = false;
    if (day >= 1 && day <= 4) {
      if (currentTime >= 730 && currentTime <= 1600) isOpen = true;
    } else if (day === 5) {
      if (currentTime >= 730 && currentTime <= 1630) isOpen = true;
    }

    return isOpen;
  };

  const isOpen = getStatus();

  return (
    <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 selection:bg-emerald-500/30">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kantor-kemenag.jpg"
          alt="Kantor Kemenag Barito Utara"
          fill
          className="object-cover scale-105 blur-[2px] opacity-40 grayscale-[20%] transition-transform duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-emerald-950/75" />
      </div>

      {/* DESKTOP VERSION */}
      <div className="hidden md:flex relative z-10 w-full max-w-7xl px-8 pt-8 pb-4 flex-col items-center h-full overflow-hidden">
        {/* Logo & Title Section */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-20 h-20 mb-4 relative bg-white/10 backdrop-blur-md p-3 rounded-2xl ring-1 ring-white/20 shadow-2xl transition-transform hover:scale-105 duration-500">
            <Image src={siteInfo.logoSrc} alt="Logo" width={120} height={120} className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <p className="mb-2 text-base font-black uppercase tracking-[0.4em] text-emerald-500/90">
            Portal Resmi
          </p>
          <h1 className="flex flex-col items-center font-black uppercase tracking-tight leading-none max-w-5xl px-2 text-center">
            <span className="text-3xl lg:text-4xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-1">
              Kementerian Agama Kabupaten Barito Utara
            </span>
          </h1>
          <p className="mt-2 text-slate-400 text-base max-w-none font-medium px-4 whitespace-nowrap">
            Akses cepat informasi dan layanan keagamaan Kabupaten Barito Utara dalam satu pintu.
          </p>
        </div>

        {/* Status & Time Indicator - Desktop (Above Grid) */}
        <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full ring-1 ring-white/10 shadow-2xl mb-4">
          <div className="flex items-center gap-3 border-r border-white/10 pr-6">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg tabular-nums">
              <Clock className="w-5 h-5" />
              {mounted ? time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              {mounted ? time.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" }) : "---"}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${isOpen ? "text-emerald-400" : "text-rose-400"}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isOpen ? "bg-emerald-400" : "bg-rose-400"}`} />
              {isOpen ? "Layanan Buka" : "Layanan Tutup"}
            </div>
            <p className="text-slate-500 text-[10px] font-medium border-l border-white/10 pl-4">
              {time.getDay() === 5 ? "Jam Kerja: 07:30 - 16:30" : "Jam Kerja: 07:30 - 16:00"}
            </p>
          </div>
        </div>

        {/* Portal Grid Section */}

        {/* Portal Grid Section */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="grid grid-cols-3 gap-x-10 gap-y-3 w-full max-w-6xl">
            {PORTAL_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative p-4 rounded-3xl transition-all duration-500 hover:-translate-y-1 flex flex-col items-start text-left h-full ${link.primary
                  ? "bg-emerald-600/20 backdrop-blur-xl ring-1 ring-emerald-500/50 hover:bg-emerald-600/30"
                  : "bg-white/5 backdrop-blur-lg ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20"
                  }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 shrink-0 ${link.primary ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800/50 text-slate-300 group-hover:text-emerald-400"
                  }`}>
                  {link.icon}
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {link.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {link.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="flex mt-auto pt-6 w-full justify-end">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${link.primary ? "bg-emerald-500 text-white" : "bg-white/10 text-white group-hover:bg-emerald-500 group-hover:translate-x-1"
                    }`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center opacity-60 hover:opacity-100 transition-opacity pb-4">
          <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">
            &copy; {new Date().getFullYear()} {siteInfo.name}
          </p>
        </div>
      </div>

      <div className="flex md:hidden relative z-10 w-full px-4 pt-10 pb-8 flex-col items-center h-full overflow-hidden">
        {/* Logo & Title Section */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 mb-4 relative bg-white/10 backdrop-blur-md p-3 rounded-2xl ring-1 ring-white/20 shadow-2xl">
            <Image src={siteInfo.logoSrc} alt="Logo" width={120} height={120} className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <p className="mb-1 text-xs font-black uppercase tracking-[0.4em] text-emerald-500/90">
            Portal Resmi
          </p>
          <h1 className="flex flex-col items-center font-black uppercase tracking-tight leading-none px-2">
            <span className="text-2xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-0.5">
              Kementerian Agama
            </span>
            <span className="text-2xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Kabupaten Barito Utara
            </span>
          </h1>
          <p className="mt-4 text-slate-400 text-[10px] max-w-[280px] font-medium px-2 leading-relaxed">
            Akses cepat informasi dan layanan keagamaan Kabupaten Barito Utara dalam satu pintu.
          </p>
        </div>

        {/* Enhanced Status & Time - Mobile (Above Grid) */}
        <div className="flex flex-col items-center bg-white/5 backdrop-blur-lg px-4 py-2.5 rounded-2xl ring-1 ring-white/10 mb-6 w-full max-w-[280px]">
          <div className="flex items-center justify-between w-full border-b border-white/5 pb-2 mb-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm tabular-nums">
              <Clock className="w-3.5 h-3.5" />
              {mounted ? time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
            </div>
            <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider ${isOpen ? "text-emerald-400" : "text-rose-400"}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOpen ? "bg-emerald-400" : "bg-rose-400"}`} />
              {isOpen ? "Layanan Buka" : "Layanan Tutup"}
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="text-slate-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {mounted ? time.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" }) : "---"}
            </div>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-tighter">
              {time.getDay() === 5 ? "07:30 - 16:30" : "07:30 - 16:00"}
            </p>
          </div>
        </div>

        {/* Portal Grid Section */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="grid grid-cols-2 gap-4 w-full px-2">
            {PORTAL_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative p-5 rounded-2xl transition-all duration-500 flex flex-col items-center text-center ${link.primary
                  ? "bg-emerald-600/20 backdrop-blur-xl ring-1 ring-emerald-500/50"
                  : "bg-white/5 backdrop-blur-lg ring-1 ring-white/10"
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 shrink-0 ${link.primary ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800/50 text-slate-300"
                  }`}>
                  {link.icon}
                </div>
                <h3 className="text-[11px] font-bold text-white line-clamp-1">
                  {link.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center opacity-60 pb-2">
          <p className="text-slate-500 text-[8px] font-medium tracking-widest uppercase">
            &copy; {new Date().getFullYear()} {siteInfo.name}
          </p>
        </div>
      </div>
    </div>
  );
}
