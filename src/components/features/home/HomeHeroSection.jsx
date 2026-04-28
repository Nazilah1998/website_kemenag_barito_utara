"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { siteInfo } from "@/data/site";

export default function HomeHeroSection() {
  const { t } = useLanguage();

  return (
    <section className="theme-hero-shell relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/kantor-kemenag.jpg"
          alt="Kantor Kementerian Agama Kabupaten Barito Utara"
          fill
          sizes="100vw"
          quality={85}
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-emerald-950/80 to-slate-900/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.20),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.10),transparent_24%)]" />

      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-yellow-500/8 blur-3xl animate-float animate-delay-300" />

      <div className="relative w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-24 xl:px-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-slide-in-left">
            <div className="glass inline-flex rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-emerald-300">
              {t("home.hero.badge")}
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.12] tracking-tight text-white md:text-5xl lg:text-6xl">
              {t("home.hero.title")}
            </h1>



            <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              {t("home.hero.description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://ptsp.kemenag-baritoutara.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="theme-primary-button group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-black transition"
              >
                {t("home.hero.ctaLayanan")}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <Link
                href="/berita"
                className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-black text-white transition hover:bg-white/15"
              >
                {t("home.hero.ctaBerita")}
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["24+", t("home.stats.layanan")],
                ["120+", t("home.stats.berita")],
                ["100%", t("home.stats.dokumen")],
              ].map(([number, label], index) => (
                <div
                  key={label}
                  className={`glass rounded-2xl p-5 animate-fade-in-up animate-delay-${(index + 1) * 100}`}
                >
                  <p className="text-3xl font-black text-white">{number}</p>
                  <p className="mt-1 text-xs font-bold tracking-wide text-emerald-300">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <HomeFocusCard t={t} />
        </div>
      </div>
    </section>
  );
}

function HomeFocusCard({ t }) {
  return (
    <div className="relative animate-slide-in-right">
      <div className="absolute -inset-4 rounded-[2rem] bg-white/6 blur-2xl" />
      <div className="theme-hero-panel relative overflow-hidden rounded-[2rem] p-6 shadow-2xl">
        <div className="theme-hero-card rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="theme-accent-soft flex h-16 w-16 items-center justify-center rounded-2xl border p-3">
              <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={52} height={52} className="object-contain" priority />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300">{siteInfo.shortName}</p>
              <h2 className="mt-1 text-xl font-black">{t("home.focus.subtitle")}</h2>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-(--primary-soft) p-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">{t("home.focus.title")}</p>
            <div className="mt-4 space-y-3">
              {[t("home.focus.point1"), t("home.focus.point2"), t("home.focus.point3")].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">✓</span>
                  <p className="theme-text-muted text-sm leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StatusBox label={t("home.focus.statusTitle")} value={t("home.focus.statusValue")} color="bg-emerald-500" />
            <StatusBox label={t("home.focus.accessTitle")} value={t("home.focus.accessValue")} color="bg-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBox({ label, value, color }) {
  return (
    <div className="rounded-2xl bg-(--surface-soft) p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color} shadow-lg`} />
        <p className="text-xl font-black">{value}</p>
      </div>
    </div>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
