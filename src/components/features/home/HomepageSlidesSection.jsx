"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useHomepageSlides } from "./hooks/useHomepageSlides";
import SectionHeader from "./components/SectionHeader";
import CategorySlider from "./components/CategorySlider";
import EmptySliderState from "./components/EmptySliderState";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    UtamaIcon,
    IslamIcon,
    KristenIcon,
    KatolikIcon,
    HinduIcon
} from "./components/HomepageSlidesIcons";

function resolveImage(value = "") {
    const raw = String(value || "").trim();
    return raw || "/kemenag.svg";
}

export default function HomepageSlidesSection({ slides = [] }) {
    const { t } = useLanguage();
    const {
        normalizedSlides,
        katolikSlides,
        kristenSlides,
        islamSlides,
        hinduSlides,
        sliderSlides,
        activeTab,
        setActiveTab,
        safeActiveIndex,
        current,
        prevSlide,
        handleNextSlide,
        setActiveIndex
    } = useHomepageSlides(slides);

    if (normalizedSlides.length === 0) return null;

    const tabs = [
        { id: "utama", label: "Utama", Icon: UtamaIcon },
        { id: "islam", label: "Islam", Icon: IslamIcon },
        { id: "kristen", label: "Kristen", Icon: KristenIcon },
        { id: "katolik", label: "Katolik", Icon: KatolikIcon },
        { id: "hindu", label: "Hindu", Icon: HinduIcon },
    ];

    return (
        <section className="w-full px-4 py-10 sm:px-10 lg:px-12 xl:px-16">
            <div className="mx-auto max-w-[1600px]">

                {/* 1. TAB NAVIGATION (Mobile Only) - No Scroll, 1 Row */}
                <div className="mb-8 flex w-full gap-1 lg:hidden">
                    {tabs.map(({ id, label, Icon }) => {
                        const isActive = activeTab === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`relative flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-3 transition-all duration-300 ${isActive
                                    ? "bg-linear-to-br from-[#0b3b46] to-[#0e5f55] text-white shadow-xl shadow-emerald-900/20 scale-105 z-10"
                                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-900/50 dark:text-slate-400"
                                    }`}
                            >
                                <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
                                    <Icon />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-tighter sm:text-[10px] ${isActive ? "opacity-100" : "opacity-70"}`}>
                                    {label}
                                </span>
                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-[#0e5f55]" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* 2. CONTENT AREA */}
                <div className="flex flex-col gap-10 lg:grid lg:grid-cols-6 lg:gap-6">

                    {/* 1. KATOLIK */}
                    <div className={`flex flex-col lg:col-span-1 ${activeTab === "katolik" ? "flex" : "hidden lg:flex"}`}>
                        <SectionHeader
                            label={t("home.katolikSection.subtitle")}
                            title={t("home.katolikSection.title")}
                            color="text-purple-700 dark:text-purple-300"
                        />
                        <CategorySlider slides={katolikSlides} fallbackTitle="Doa & Renungan" />
                    </div>

                    {/* 2. KRISTEN */}
                    <div className={`flex flex-col lg:col-span-1 ${activeTab === "kristen" ? "flex" : "hidden lg:flex"}`}>
                        <SectionHeader
                            label={t("home.christianSection.subtitle")}
                            title={t("home.christianSection.title")}
                            color="text-blue-700 dark:text-blue-300"
                        />
                        <CategorySlider slides={kristenSlides} fallbackTitle="Renungan Iman" />
                    </div>

                    {/* 3. TENGAH: SLIDER UTAMA (Posisi Tengah di Desktop) */}
                    <div className={`w-full md:col-span-2 lg:col-span-2 ${activeTab === "utama" ? "flex flex-col" : "hidden lg:flex"}`}>
                        <SectionHeader
                            label="SLIDER BERANDA"
                            title="Informasi Utama"
                            color="text-emerald-700 dark:text-emerald-300"
                            center
                        />
                        {sliderSlides.length > 0 ? (
                            <div className="relative">
                                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/50">
                                    <div className="relative h-[280px] sm:h-[420px] lg:h-[480px]">
                                        <Image
                                            key={current.id || `${safeActiveIndex}-${current.title}`}
                                            src={resolveImage(current.image_url)}
                                            alt={current.title || "Slide beranda"}
                                            fill
                                            className="object-contain animate-[fadeIn_700ms_ease-in-out]"
                                            loading="lazy"
                                        />
                                    </div>

                                    {sliderSlides.length > 1 && (
                                        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                                            <div className="rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
                                                {safeActiveIndex + 1} / {sliderSlides.length}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={prevSlide}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
                                                    aria-label="Slide sebelumnya"
                                                >
                                                    <ChevronLeftIcon />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleNextSlide}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
                                                    aria-label="Slide berikutnya"
                                                >
                                                    <ChevronRightIcon />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 text-center">
                                    <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-slate-100 sm:text-xl">
                                        {current.title}
                                    </h3>
                                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm sm:leading-6">
                                        {current.caption || "Informasi terbaru dari Kemenag Barito Utara."}
                                    </p>

                                    {sliderSlides.length > 1 && (
                                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                            {sliderSlides.map((item, index) => (
                                                <button
                                                    key={item.id || `${item.title}-${index}`}
                                                    type="button"
                                                    onClick={() => setActiveIndex(index)}
                                                    className={`h-1.5 rounded-full transition-all ${index === safeActiveIndex
                                                        ? "w-5 bg-emerald-600"
                                                        : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
                                                        }`}
                                                    aria-label={`Pilih slide ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <EmptySliderState />
                        )}
                    </div>

                    {/* 4. ISLAM */}
                    <div className={`flex flex-col lg:col-span-1 ${activeTab === "islam" ? "flex" : "hidden lg:flex"}`}>
                        <SectionHeader
                            label={t("home.islamicSection.subtitle")}
                            title={t("home.islamicSection.title")}
                            color="text-amber-700 dark:text-amber-300"
                            align="right"
                        />
                        <CategorySlider slides={islamSlides} fallbackTitle="Mutiara Hikmah" />
                    </div>

                    {/* 5. HINDU */}
                    <div className={`flex flex-col lg:col-span-1 ${activeTab === "hindu" ? "flex" : "hidden lg:flex"}`}>
                        <SectionHeader
                            label={t("home.hinduSection.subtitle")}
                            title={t("home.hinduSection.title")}
                            color="text-rose-700 dark:text-rose-300"
                            align="right"
                        />
                        <CategorySlider slides={hinduSlides} fallbackTitle="Dharma Wacana" />
                    </div>
                </div>
            </div>
        </section>
    );
}
