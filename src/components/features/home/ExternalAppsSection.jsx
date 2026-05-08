"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const getExternalApps = (locale) => [
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
        title: "ASN DIGITAL",
        description:
            locale === "id"
                ? "Platform layanan ASN digital dari Badan Kepegawaian Negara."
                : "Digital ASN service platform from the National Civil Service Agency.",
        href: "https://asndigital.bkn.go.id/",
        icon: "/apps/asn-digital.png",
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
    const { t, locale } = useLanguage();
    const apps = getExternalApps(locale);
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev === apps.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev === 0 ? apps.length - 1 : prev - 1));
    };

    return (
        <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-24 xl:px-20">
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

            {/* MOBILE & TABLET SLIDER (DIBUAT SEPERTI APA KATA MEREKA) */}
            <div className="relative lg:hidden">
                <div className="overflow-hidden rounded-[2rem]">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                    >
                        {apps.map((app) => (
                            <div key={app.title} className="w-full flex-none flex flex-col items-center py-4">
                                <Link
                                    href={app.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl ring-4 ring-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:ring-emerald-900/10">
                                        <div className="flex h-full w-full items-center justify-center p-6">
                                            <Image
                                                src={app.icon}
                                                alt={app.title}
                                                width={64}
                                                height={64}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                    <h3 className="mt-6 text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                        {app.title}
                                    </h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation (Sesuai Referensi Gambar) */}
                <div className="mt-8 flex items-center justify-center gap-6">
                    <button
                        onClick={prevSlide}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-slate-400 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none"
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
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-200/50 text-slate-400 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* DESKTOP GRID (DIKEMBALIKAN KE ASAL) */}
            <div className="mt-8 hidden gap-4 sm:grid-cols-2 lg:grid xl:grid-cols-5">
                {apps.map((app) => (
                    <Link
                        key={app.title}
                        href={app.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                    >
                        <div className="flex items-center justify-between">
                            <div className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-50 text-base font-black text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                                <Image
                                    src={app.icon}
                                    alt={`Logo ${app.title}`}
                                    width={42}
                                    height={42}
                                    className="h-10 w-10 object-contain"
                                />
                            </div>
                            <span className="text-sm text-emerald-700 transition group-hover:translate-x-1 dark:text-emerald-300">
                                ↗
                            </span>
                        </div>

                        <h3 className="mt-4 text-base font-black text-slate-900 dark:text-slate-100">
                            {app.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                            {app.description}
                        </p>

                        <div className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                            Buka Aplikasi
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
