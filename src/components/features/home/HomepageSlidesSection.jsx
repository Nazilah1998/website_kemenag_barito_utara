"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useHomepageSlides } from "./hooks/useHomepageSlides";
import SectionHeader from "./components/SectionHeader";
import CategorySlider from "./components/CategorySlider";
import EmptySliderState from "./components/EmptySliderState";
import { motion, AnimatePresence } from "framer-motion";
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

    if (normalizedSlides.length === 0) return null;

    const tabs = [
        { id: "utama", label: "Utama", Icon: UtamaIcon },
        { id: "islam", label: "Islam", Icon: IslamIcon },
        { id: "kristen", label: "Kristen", Icon: KristenIcon },
        { id: "katolik", label: "Katolik", Icon: KatolikIcon },
        { id: "hindu", label: "Hindu", Icon: HinduIcon },
    ];

    return (
        <section className="w-full px-4 py-10 sm:px-10 lg:px-12 xl:px-16 overflow-hidden">
            <div className="mx-auto max-w-[1600px]">

                {/* 1. FLOATING TAB NAVIGATION (Mobile Only) - Modern Pill Dock with Sliding Indicator */}
                <div className="mb-10 lg:hidden">
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
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 -z-10 rounded-full bg-emerald-600 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)]"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
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
                    <div className={`mobile-tab-content group relative flex flex-col lg:col-span-1 transition-all duration-700 lg:mt-24 lg:scale-[0.85] lg:opacity-100 hover:scale-90 ${activeTab === "katolik" ? "active" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-purple-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-purple-950/20" />
                        <div className="relative flex flex-col">
                            <SectionHeader
                                label={t("home.katolikSection.subtitle")}
                                title={t("home.katolikSection.title")}
                                color="text-purple-800 dark:text-purple-200"
                            />
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="rounded-2xl shadow-[0_20px_50px_-20px_rgba(168,85,247,0.15)] transition-shadow group-hover:shadow-[0_20px_50px_-10px_rgba(168,85,247,0.3)]"
                            >
                                <CategorySlider slides={katolikSlides} fallbackTitle="Doa & Renungan" />
                            </motion.div>
                        </div>
                    </div>

                    {/* 2. KRISTEN (Kiri Tengah) */}
                    <div className={`mobile-tab-content group relative flex flex-col lg:col-span-1 transition-all duration-700 lg:mt-12 lg:scale-[0.95] lg:opacity-100 hover:scale-100 ${activeTab === "kristen" ? "active" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-blue-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-950/20" />
                        <div className="relative flex flex-col">
                            <SectionHeader
                                label={t("home.christianSection.subtitle")}
                                title={t("home.christianSection.title")}
                                color="text-blue-800 dark:text-blue-200"
                            />
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="rounded-2xl shadow-[0_20px_50px_-20px_rgba(59,130,246,0.15)] transition-shadow group-hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.3)]"
                            >
                                <CategorySlider slides={kristenSlides} fallbackTitle="Renungan Iman" />
                            </motion.div>
                        </div>
                    </div>

                    {/* 3. TENGAH: SLIDER UTAMA (Fokus Utama) */}
                    <div className={`mobile-tab-content group relative w-full md:col-span-2 lg:col-span-2 transition-all duration-700 lg:scale-[1.05] lg:z-20 ${activeTab === "utama" ? "active flex flex-col" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-6 -z-10 rounded-[4rem] bg-gradient-to-b from-emerald-100/60 to-transparent dark:from-emerald-950/30" />
                        <div className="relative flex flex-col">
                            <SectionHeader
                                label="SLIDER BERANDA"
                                title="Informasi Utama"
                                color="text-emerald-700 dark:text-emerald-300"
                                center
                            />
                            {sliderSlides.length > 0 ? (
                                <div className="relative">
                                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-emerald-500/20 dark:bg-slate-900/50 dark:shadow-none">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={safeActiveIndex}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                                className="relative aspect-[3/4] sm:aspect-auto sm:h-[420px] lg:h-[600px] w-full"
                                            >
                                                <Image
                                                    src={resolveImage(current.image_url)}
                                                    alt={current.title || "Slide beranda"}
                                                    fill
                                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                                    className="object-cover lg:object-contain"
                                                />
                                            </motion.div>
                                        </AnimatePresence>

                                        {sliderSlides.length > 1 && (
                                            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
                                                <div className="rounded-full bg-black/75 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
                                                    {safeActiveIndex + 1} / {sliderSlides.length}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        type="button"
                                                        onClick={prevSlide}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
                                                        aria-label="Slide sebelumnya"
                                                    >
                                                        <ChevronLeftIcon />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        type="button"
                                                        onClick={handleNextSlide}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
                                                        aria-label="Slide berikutnya"
                                                    >
                                                        <ChevronRightIcon />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={safeActiveIndex}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.25 }}
                                            className="mt-6 text-center"
                                        >
                                            <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-slate-100 sm:text-xl">
                                                {current.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm sm:leading-6">
                                                {current.caption || "Informasi terbaru dari Kemenag Barito Utara."}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>

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
                            ) : (
                                <EmptySliderState />
                            )}
                        </div>
                    </div>

                    {/* 4. ISLAM (Kanan Tengah) */}
                    <div className={`mobile-tab-content group relative flex flex-col lg:col-span-1 transition-all duration-700 lg:mt-12 lg:scale-[0.95] lg:opacity-100 hover:scale-100 ${activeTab === "islam" ? "active" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-amber-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-amber-950/20" />
                        <div className="relative flex flex-col">
                            <SectionHeader
                                label={t("home.islamicSection.subtitle")}
                                title={t("home.islamicSection.title")}
                                color="text-amber-800 dark:text-amber-200"
                                align="right"
                            />
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="rounded-2xl shadow-[0_20px_50px_-20px_rgba(245,158,11,0.15)] transition-shadow group-hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.3)]"
                            >
                                <CategorySlider slides={islamSlides} fallbackTitle="Mutiara Hikmah" />
                            </motion.div>
                        </div>
                    </div>

                    {/* 5. HINDU (Ujung Kanan) */}
                    <div className={`mobile-tab-content group relative flex flex-col lg:col-span-1 transition-all duration-700 lg:mt-24 lg:scale-[0.85] lg:opacity-100 hover:scale-90 ${activeTab === "hindu" ? "active" : "inactive lg:flex"}`}>
                        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-rose-100/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-rose-950/20" />
                        <div className="relative flex flex-col">
                            <SectionHeader
                                label={t("home.hinduSection.subtitle")}
                                title={t("home.hinduSection.title")}
                                color="text-rose-800 dark:text-rose-200"
                                align="right"
                            />
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="rounded-2xl shadow-[0_20px_50px_-20px_rgba(244,63,94,0.15)] transition-shadow group-hover:shadow-[0_20px_50px_-10px_rgba(244,63,94,0.3)]"
                            >
                                <CategorySlider slides={hinduSlides} fallbackTitle="Dharma Wacana" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
