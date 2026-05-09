"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const getExternalApps = (locale) => [
    {
        title: "PUSAKA",
        description:
            locale === "id"
                ? "Portal layanan digital terintegrasi Kementerian Agama."
                : "Integrated digital service portal of the Ministry of Religious Affairs.",
        href: "https://pusaka-v3.kemenag.go.id/",
        icon: "/apps/pusaka.png",
    },
    {
        title: "EMIS",
        description:
            locale === "id"
                ? "Layanan data dan informasi pendidikan Islam terpadu."
                : "Integrated Islamic education data and information services.",
        href: "https://emisgtk.kemenag.go.id/",
        icon: "/apps/emis.png",
    },
    {
        title: "TTE KEMENAG",
        description:
            locale === "id"
                ? "Sistem tanda tangan elektronik terintegrasi Kementerian Agama."
                : "Electronic signature system integrated with the Ministry of Religious Affairs.",
        href: "https://tte.kemenag.go.id/login",
        icon: "/apps/logo-bsre.png?v=2",
    },
    {
        title: "ASN DIGITAL",
        description:
            locale === "id"
                ? "Platform layanan ASN digital dari Badan Kepegawaian Negara."
                : "Digital ASN service platform from the National Civil Service Agency.",
        href: "https://asndigital.bkn.go.id/",
        icon: "/apps/asn-digital.png",
    },
    {
        title: "MOOC PINTAR",
        description:
            locale === "id"
                ? "Platform pelatihan mandiri (Massive Open Online Course) Kementerian Agama."
                : "Ministry of Religious Affairs independent training platform (Massive Open Online Course).",
        href: "https://pintar.kemenag.go.id/",
        icon: "/apps/pintar.png?v=2",
    },
    {
        title: "SIMPEG 5",
        description:
            locale === "id"
                ? "Sistem informasi manajemen kepegawaian Kementerian Agama."
                : "Personnel management information system of the Ministry of Religious Affairs.",
        href: "https://simpeg5.kemenag.go.id/",
        icon: "/apps/simpeg5.png",
    },
    {
        title: "SRIKANDI",
        description:
            locale === "id"
                ? "Aplikasi arsip dinamis terintegrasi nasional."
                : "National integrated dynamic archive application.",
        href: "https://srikandi.arsip.go.id/",
        icon: "/apps/srikandi.png",
    },
];

export default function ExternalAppsSection() {
    const { locale } = useLanguage();
    const apps = getExternalApps(locale);
    const [activeIndex, setActiveIndex] = useState(Math.floor(apps.length / 2));

    const nextSlide = () => {
        if (activeIndex < apps.length - 1) {
            setActiveIndex((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
        }
    };

    return (
        <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-24 xl:px-20 overflow-hidden">
            <div className="max-w-3xl mb-12">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400">
                    LINK APLIKASI
                </p>
                <h2 className="mt-4 text-3xl font-black text-slate-900 dark:text-white lg:text-4xl">
                    Aplikasi Eksternal Terkait
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    Pilih aplikasi yang dibutuhkan. Setiap tautan akan dibuka di tab baru agar akses portal utama tetap terbuka.
                </p>
            </div>

            {/* MOBILE SLIDER (KEMBALI KE TAMPILAN FIX SEBELUMNYA) */}
            <div className="relative lg:hidden overflow-hidden py-4">
                <div
                    className="flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
                    style={{ transform: `translateX(calc(50% - ${(activeIndex * 40) + 20}%))` }}
                >
                    {apps.map((app, i) => {
                        const isActive = i === activeIndex;
                        return (
                            <div
                                key={app.title}
                                className={`w-[40%] flex-none flex flex-col items-center transition-all duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isActive ? "scale-110 opacity-100 z-10" : "scale-75 opacity-45 grayscale blur-[1px]"
                                    }`}
                            >
                                <Link
                                    href={app.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className={`relative h-20 w-20 overflow-hidden rounded-full border-2 bg-white shadow-xl transition-all duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isActive ? "border-emerald-500 ring-4 ring-emerald-100 dark:border-emerald-400 dark:bg-slate-900 dark:ring-emerald-900/20" : "border-slate-200 dark:border-slate-800 dark:bg-slate-900"
                                        }`}>
                                        <div className="flex h-full w-full items-center justify-center p-5">
                                            <Image
                                                src={app.icon}
                                                alt={app.title}
                                                width={64}
                                                height={64}
                                                className="h-full w-full object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <h3 className={`mt-4 text-[10px] font-black uppercase tracking-tight transition-all duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isActive ? "text-slate-800 opacity-100 dark:text-white translate-y-0" : "text-slate-400 opacity-0 -translate-y-2"
                                        }`}>
                                        {app.title}
                                    </h3>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Mobile */}
                <div className="mt-8 flex items-center justify-center gap-6">
                    <button
                        onClick={prevSlide}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-slate-400 transition-all duration-300 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none ${activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
                            }`}
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>

                    <div className="flex gap-2">
                        {apps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 bg-emerald-600" : "w-1.5 bg-slate-300"}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-slate-400 transition-all duration-300 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none ${activeIndex === apps.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                            }`}
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* DESKTOP PREMIUM GRID (7 KOLOM - 1 BARIS) */}
            <div className="hidden lg:grid mt-12 gap-5 xl:grid-cols-7">
                {apps.map((app) => (
                    <Link
                        key={app.title}
                        href={app.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col items-center rounded-none border border-slate-200 bg-white p-6 text-center transition-all duration-500 hover:-translate-y-3 hover:border-emerald-300 hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl dark:hover:border-emerald-500/50"
                    >
                        {/* Background Glow Effect */}
                        <div className="absolute inset-0 -z-10 rounded-none bg-gradient-to-b from-emerald-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-500 group-hover:from-emerald-50/50 group-hover:to-transparent dark:group-hover:from-emerald-900/10" />

                        <div className="relative mb-6">
                            {/* Icon Container with Ring Animation */}
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 p-5 shadow-inner transition-all duration-500 group-hover:bg-white group-hover:shadow-lg dark:bg-slate-800 dark:group-hover:bg-slate-700">
                                <Image
                                    src={app.icon}
                                    alt={`Logo ${app.title}`}
                                    width={64}
                                    height={64}
                                    className="h-12 w-12 object-contain transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                />

                                {/* Orbit Ring (Visible on Hover) */}
                                <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/0 transition-all duration-500 group-hover:inset-0 group-hover:border-emerald-500/20 group-hover:rotate-180" />
                            </div>
                        </div>

                        <div className="flex flex-col flex-grow">
                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800 dark:text-white lg:text-[13px]">
                                {app.title}
                            </h3>

                            <div className="mt-3 flex-grow">
                                <p className="line-clamp-3 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                    {app.description}
                                </p>
                            </div>
                        </div>

                        {/* Interactive Footer */}
                        <div className="mt-6 flex h-10 w-full items-center justify-center rounded-2xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-800 dark:group-hover:bg-emerald-600">
                            <span>Akses Portal</span>
                            <svg className="ml-2 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
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
