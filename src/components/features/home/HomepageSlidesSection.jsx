"use client";

import React, { useState, useEffect } from "react";
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
    return raw || "/assets/branding/kemenag.svg";
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

    const [selectedSlide, setSelectedSlide] = useState(null);

    useEffect(() => {
        if (selectedSlide) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedSlide]);

    if (normalizedSlides.length === 0) return null;

    const tabs = [
        { id: "katolik", label: "Katolik", Icon: KatolikIcon },
        { id: "kristen", label: "Kristen", Icon: KristenIcon },
        { id: "utama", label: "Utama", Icon: UtamaIcon },
        { id: "islam", label: "Islam", Icon: IslamIcon },
        { id: "hindu", label: "Hindu", Icon: HinduIcon },
    ];

    return (
        <section className="w-full px-4 py-10 sm:px-10 lg:px-12 xl:px-16 overflow-hidden">
            <div className="mx-auto max-w-[1600px]">

                {/* 1. GLOBAL MOBILE HEADER */}
                <div className="mb-6 lg:hidden">
                    <SectionHeader
                        label="SLIDER BERANDA"
                        title="Informasi Utama"
                        color="text-emerald-700 dark:text-emerald-300"
                        center
                    />
                </div>

                {/* 2. FLOATING TAB NAVIGATION (Mobile Only) - Modern Pill Dock with Sliding Indicator */}
                <div className="mb-2 lg:hidden relative z-20">
                    <div className="relative mx-auto flex w-fit items-center gap-1 rounded-full border border-slate-200/60 bg-white/50 p-1.5 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/60 dark:shadow-none">
                        {tabs.map(({ id, label, Icon }) => {
                            const isActive = activeTab === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`relative flex min-w-[60px] flex-col items-center justify-center gap-1 rounded-full py-2.5 transition-all duration-300 z-10 ${isActive
                                        ? "text-white scale-105"
                                        : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 -z-10 rounded-full bg-emerald-600 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)]" />
                                    )}

                                    <div className={`transition-transform duration-300 ${isActive ? "scale-105" : "scale-90"}`}>
                                        <Icon />
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-80"}`}>
                                        {label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. CONTENT AREA - Animated Transitions */}
                <div className="relative flex flex-col gap-10 lg:grid lg:grid-cols-6 lg:gap-6">
                    {/* Content Slot for Mobile (Overlay items in same spot) */}
                    <style jsx>{`
                        @media (max-width: 1023px) {
                            .mobile-tab-content {
                                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                                position: relative;
                            }
                            .mobile-tab-content.inactive {
                                opacity: 0;
                                transform: translateY(20px);
                                pointer-events: none;
                                position: absolute;
                                width: 100%;
                            }
                            .mobile-tab-content.active {
                                opacity: 1;
                                transform: translateY(0);
                                z-index: 10;
                            }
                        }
                    `}</style>

                    {/* 1. KATOLIK (Ujung Kiri) */}
                    <div className={`mobile-tab-content group relative flex flex-col lg:col-span-1 transition-all duration-700 lg:mt-24 lg:scale-[0.95] lg:opacity-100 hover:scale-100 ${activeTab === "katolik" ? "active" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-purple-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-purple-950/20" />
                        <div className="relative flex flex-col">
                            <SectionHeader
                                label={t("home.katolikSection.subtitle")}
                                title={t("home.katolikSection.title")}
                                color="text-purple-800 dark:text-purple-200"
                            />
                            <div
                                className="lg:rounded-2xl lg:shadow-[0_20px_50px_-20px_rgba(168,85,247,0.15)] lg:transition-all lg:duration-300 lg:hover:-translate-y-1.5 lg:group-hover:shadow-[0_20px_50px_-10px_rgba(168,85,247,0.3)]"
                            >
                                <CategorySlider slides={katolikSlides} fallbackTitle="Doa & Renungan" onSlideClick={setSelectedSlide} />
                            </div>
                        </div>
                    </div>

                    {/* 2. KRISTEN (Kiri Tengah) */}
                    <div className={`mobile-tab-content group relative flex flex-col lg:col-span-1 transition-all duration-700 lg:mt-12 lg:scale-100 lg:opacity-100 hover:scale-105 ${activeTab === "kristen" ? "active" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-blue-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-950/20" />
                        <div className="relative flex flex-col">
                            <SectionHeader
                                label={t("home.christianSection.subtitle")}
                                title={t("home.christianSection.title")}
                                color="text-blue-800 dark:text-blue-200"
                            />
                            <div
                                className="lg:rounded-2xl lg:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.15)] lg:transition-all lg:duration-300 lg:hover:-translate-y-1.5 lg:group-hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.3)]"
                            >
                                <CategorySlider slides={kristenSlides} fallbackTitle="Renungan Iman" onSlideClick={setSelectedSlide} />
                            </div>
                        </div>
                    </div>

                    {/* 3. TENGAH: SLIDER UTAMA (Fokus Utama) */}
                    <div className={`mobile-tab-content group relative w-full md:col-span-2 lg:col-span-2 transition-all duration-700 lg:scale-[1.05] lg:z-20 ${activeTab === "utama" ? "active flex flex-col" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-6 -z-10 rounded-[4rem] bg-gradient-to-b from-emerald-100/60 to-transparent dark:from-emerald-950/30" />
                        <div className="relative flex flex-col">
                            <div className="hidden lg:block">
                                <SectionHeader
                                    label="SLIDER BERANDA"
                                    title="Informasi Utama"
                                    color="text-emerald-700 dark:text-emerald-300"
                                    center
                                />
                            </div>
                            {sliderSlides.length > 0 ? (
                                <>
                                    {/* MOBILE CAROUSEL VIEW */}
                                    <div className="lg:hidden relative overflow-hidden py-4 -mx-4 sm:-mx-10 mt-2">
                                        <div
                                            className="flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
                                            style={{ transform: `translateX(calc(50% - ${safeActiveIndex * 85 + 42.5}%))` }}
                                        >
                                            {sliderSlides.map((item, index) => {
                                                const isActive = index === safeActiveIndex;
                                                return (
                                                    <div
                                                        key={item.id || index}
                                                        className={`w-[85%] flex-none px-2 transition-all duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isActive ? "scale-100 opacity-100 z-10" : "scale-[0.92] opacity-40 blur-[1px]"}`}
                                                    >
                                                        <div 
                                                            className="relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-emerald-500/10 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 cursor-pointer"
                                                            onClick={() => setSelectedSlide(item)}
                                                        >
                                                            <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden">
                                                                <Image
                                                                    src={resolveImage(item.image_url)}
                                                                    alt={item.title || "Slide beranda"}
                                                                    fill
                                                                    sizes="(max-width: 1024px) 85vw"
                                                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                                                />
                                                            </div>
                                                            <div className="pt-5 pb-6 px-5 text-center">
                                                                <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-slate-100 line-clamp-2">
                                                                    {item.title}
                                                                </h3>
                                                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                                                    {item.caption || "Informasi terbaru dari Kemenag Barito Utara."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Mobile Navigation Controls */}
                                        <div className="mt-6 flex flex-col items-center justify-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={prevSlide}
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-emerald-700 transition hover:bg-emerald-700 hover:text-white dark:bg-slate-800"
                                                    aria-label="Slide sebelumnya"
                                                >
                                                    <ChevronLeftIcon />
                                                </button>
                                                <div className="flex gap-1.5">
                                                    {sliderSlides.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => setActiveIndex(index)}
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${index === safeActiveIndex ? "w-6 bg-emerald-600" : "w-1.5 bg-slate-300 dark:bg-slate-600"}`}
                                                            aria-label={`Pilih slide ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleNextSlide}
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-emerald-700 transition hover:bg-emerald-700 hover:text-white dark:bg-slate-800"
                                                    aria-label="Slide berikutnya"
                                                >
                                                    <ChevronRightIcon />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DESKTOP VIEW (Original) */}
                                    <div className="hidden lg:block relative">
                                        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-emerald-500/20 dark:bg-slate-900/50 dark:shadow-none">
                                            <div
                                                className="relative h-[600px] w-full cursor-pointer"
                                                onClick={() => setSelectedSlide(current)}
                                            >
                                                <Image
                                                    src={resolveImage(current.image_url)}
                                                    alt={current.title || "Slide beranda"}
                                                    fill
                                                    priority={safeActiveIndex === 0}
                                                    sizes="40vw"
                                                    className="object-contain bg-slate-50 dark:bg-slate-800/50"
                                                />
                                            </div>

                                            {sliderSlides.length > 1 && (
                                                <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between">
                                                    <div className="rounded-full bg-black/75 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                                                        {safeActiveIndex + 1} / {sliderSlides.length}
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={prevSlide}
                                                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-black/60 active:scale-95"
                                                        >
                                                            <ChevronLeftIcon />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleNextSlide}
                                                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-black/60 active:scale-95"
                                                        >
                                                            <ChevronRightIcon />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8 text-center px-4">
                                            <h3 className="text-xl font-black leading-tight text-slate-900 dark:text-slate-100">
                                                {current.title}
                                            </h3>
                                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                {current.caption || "Informasi terbaru dari Kemenag Barito Utara."}
                                            </p>
                                        </div>

                                        {sliderSlides.length > 1 && (
                                            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                                                {sliderSlides.map((item, index) => (
                                                    <button
                                                        key={item.id || `${item.title}-${index}`}
                                                        type="button"
                                                        onClick={() => setActiveIndex(index)}
                                                        className={`h-1.5 rounded-full transition-all ${index === safeActiveIndex
                                                            ? "w-6 bg-emerald-600"
                                                            : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <EmptySliderState />
                            )}
                        </div>
                    </div>

                    {/* 4. ISLAM (Kanan Tengah) */}
                    <div className={`mobile-tab-content group relative flex flex-col lg:col-span-1 transition-all duration-700 lg:mt-12 lg:scale-100 lg:opacity-100 hover:scale-105 ${activeTab === "islam" ? "active" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-amber-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-amber-950/20" />
                        <div className="relative flex flex-col">
                            <SectionHeader
                                label={t("home.islamicSection.subtitle")}
                                title={t("home.islamicSection.title")}
                                color="text-amber-800 dark:text-amber-200"
                                align="right"
                            />
                            <div
                                className="lg:rounded-2xl lg:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.15)] lg:transition-all lg:duration-300 lg:hover:-translate-y-1.5 lg:group-hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.3)]"
                            >
                                <CategorySlider slides={islamSlides} fallbackTitle="Mutiara Hikmah" onSlideClick={setSelectedSlide} />
                            </div>
                        </div>
                    </div>

                    {/* 5. HINDU (Ujung Kanan) */}
                    <div className={`mobile-tab-content group relative flex flex-col lg:col-span-1 transition-all duration-700 lg:mt-24 lg:scale-[0.95] lg:opacity-100 hover:scale-100 ${activeTab === "hindu" ? "active" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-rose-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-rose-950/20" />
                        <div className="relative flex flex-col">
                            <SectionHeader
                                label={t("home.hinduSection.subtitle")}
                                title={t("home.hinduSection.title")}
                                color="text-rose-800 dark:text-rose-200"
                                align="right"
                            />
                            <div
                                className="lg:rounded-2xl lg:shadow-[0_20px_50px_-20px_rgba(244,63,94,0.15)] lg:transition-all lg:duration-300 lg:hover:-translate-y-1.5 lg:group-hover:shadow-[0_20px_50px_-10px_rgba(244,63,94,0.3)]"
                            >
                                <CategorySlider slides={hinduSlides} fallbackTitle="Dharma Wacana" onSlideClick={setSelectedSlide} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX MODAL */}
            {selectedSlide && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedSlide(null)}
                    />
                    <div className="relative w-full max-w-4xl flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl animate-[fadeIn_300ms_ease-out]">
                        <button 
                            onClick={() => setSelectedSlide(null)}
                            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors backdrop-blur-md"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="relative w-full aspect-[4/5] sm:aspect-video bg-slate-100 dark:bg-slate-950">
                            <Image
                                src={resolveImage(selectedSlide.image_url)}
                                alt={selectedSlide.title || "Slide image"}
                                fill
                                sizes="(max-width: 896px) 100vw, 896px"
                                className="object-contain"
                            />
                        </div>
                        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900">
                            <h3 className="text-xl sm:text-2xl font-black leading-tight text-slate-900 dark:text-white">
                                {selectedSlide.title}
                            </h3>
                            {selectedSlide.caption && (
                                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                                    {selectedSlide.caption}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
