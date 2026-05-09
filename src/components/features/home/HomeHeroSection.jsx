"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { siteInfo } from "@/data/site";

export default function HomeHeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative h-[calc(100vh-140px)] min-h-[600px] max-h-[900px] w-full overflow-hidden bg-slate-950 flex items-center">
      {/* 1. LAYERED BACKGROUND SYSTEM */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kantor-kemenag.jpg"
          alt="Kantor Kementerian Agama Kabupaten Barito Utara"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover opacity-30 mix-blend-luminosity scale-105"
          priority
        />
        {/* Dynamic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-emerald-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(5,150,105,0.08),transparent_30%)]" />

        {/* Animated Orbs */}
        <div className="absolute -left-20 top-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" />
        <div className="absolute -right-20 bottom-10 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[80px] animate-pulse delay-700" />
      </div>

      {/* 2. CONTENT CONTAINER */}
      <div className="relative z-10 w-full px-6 py-8 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto grid max-w-[1600px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

          {/* Left Column: Text & Stats */}
          <div className="flex flex-col animate-fade-in">
            {/* Badge */}
            <div className="group flex w-fit items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md transition-all hover:border-emerald-500/50">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400">
                {t("home.hero.badge")}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl xl:text-6xl">
              {t("home.hero.title").split('.').map((part, i) => (
                <span key={i} className={i === 0 ? "block" : "block bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent"}>
                  {part}{i === 0 && part ? "." : ""}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base lg:leading-loose">
              {t("home.hero.description")}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://ptsp.kemenag-baritoutara.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-emerald-600 px-6 py-3.5 text-[12px] font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-500 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]"
              >
                <span className="relative z-10">{t("home.hero.ctaLayanan")}</span>
                <ArrowRightIcon className="relative z-10 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-transform duration-500 group-hover:translate-x-0" />
              </a>

              <Link
                href="/berita"
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-[12px] font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
              >
                {t("home.hero.ctaBerita")}
              </Link>
            </div>

            {/* Stats - Grid Modern */}
            <div className="mt-12 grid grid-cols-3 gap-6 sm:max-w-lg">
              {[
                { number: "24+", label: t("home.stats.layanan"), icon: "⚡" },
                { number: "120+", label: t("home.stats.berita"), icon: "📰" },
                { number: "100%", label: t("home.stats.dokumen"), icon: "🛡️" },
              ].map((stat, i) => (
                <div key={i} className="group flex flex-col gap-1 transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white lg:text-3xl">{stat.number}</span>
                    <span className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:inline text-lg">{stat.icon}</span>
                  </div>
                  <div className="h-0.5 w-6 rounded-full bg-emerald-500/50 transition-all group-hover:w-full group-hover:bg-emerald-500" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Focus Card */}
          <div className="relative perspective-1000 hidden lg:block">
            <div className="animate-float">
              <HomeFocusCard t={t} />
            </div>

            {/* Floating Accent Elements */}
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm animate-pulse" />
            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm animate-bounce-slow" />
          </div>
        </div>
      </div>

      {/* 3. SCROLL INDICATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
        <div className="h-8 w-5 rounded-full border-2 border-white/20 p-1">
          <div className="mx-auto h-1.5 w-0.5 rounded-full bg-white" />
        </div>
      </div>
    </section>
  );
}

function HomeFocusCard({ t }) {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/40 p-1 shadow-2xl backdrop-blur-3xl transition-all duration-700 hover:border-emerald-500/30 hover:bg-slate-900/60">
      {/* Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative rounded-[28px] bg-slate-950/50 p-6 xl:p-8">
        {/* Header Content */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute -inset-1.5 rounded-2xl bg-emerald-500/20 blur-lg animate-pulse" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-inner">
              <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={50} height={50} className="object-contain" priority />
            </div>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-400 opacity-80">{siteInfo.shortName}</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-white">{t("home.focus.subtitle")}</h2>
          </div>
        </div>

        {/* Highlight Section */}
        <div className="mt-8 space-y-5 rounded-[24px] border border-white/5 bg-white/5 p-6 transition-colors group-hover:bg-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="h-1 w-6 rounded-full bg-emerald-500" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400">{t("home.focus.title")}</p>
          </div>

          <div className="space-y-4">
            {[t("home.focus.point1"), t("home.focus.point2"), t("home.focus.point3")].map((item, i) => (
              <div key={i} className="flex items-start gap-3 group/item">
                <div className="mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-emerald-500/50 text-[9px] text-emerald-500 transition-colors group-hover/item:bg-emerald-500 group-hover/item:text-white">
                  ✓
                </div>
                <p className="text-[13px] leading-relaxed text-slate-400 transition-colors group-hover/item:text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats/Status */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <StatusBox
            label={t("home.focus.statusTitle")}
            value={t("home.focus.statusValue")}
            color="bg-emerald-500"
            glow="shadow-emerald-500/40"
          />
          <StatusBox
            label={t("home.focus.accessTitle")}
            value={t("home.focus.accessValue")}
            color="bg-blue-500"
            glow="shadow-blue-500/40"
          />
        </div>
      </div>
    </div>
  );
}

function StatusBox({ label, value, color, glow }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-transform hover:scale-[1.02]">
      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400/70">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${color} ${glow} shadow-[0_0_8px_rgba(0,0,0,0.5)] animate-pulse`} />
        <p className="text-base font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
