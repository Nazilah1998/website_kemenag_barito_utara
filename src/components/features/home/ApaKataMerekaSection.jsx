"use client";

import { useState } from "react";
import Image from "next/image";
import { getApaKataMereka } from "@/data/apaKataMereka";
import { useLanguage } from "@/context/LanguageContext";

function ChevronLeftIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

export default function ApaKataMerekaSection() {
    const { t, locale } = useLanguage();
    const rawData = getApaKataMereka(locale);

    // Reorder data to: [Menteri, Arbaja, Kanwil] to match user's mental model
    // Original: 0=Menteri, 1=Kanwil, 2=Arbaja
    const data = [rawData[0], rawData[2], rawData[1]];

    const [activeIndex, setActiveIndex] = useState(1); // Default to Arbaja (index 1 in the new order)

    const nextPerson = () => {
        if (activeIndex < data.length - 1) {
            setActiveIndex((prev) => prev + 1);
        }
    };

    const prevPerson = () => {
        if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
        }
    };

    return (
        <section className="py-16 lg:py-20 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400">
                        ZONA INTEGRITAS
                    </p>
                    <h2 className="mt-4 text-3xl font-black leading-none text-slate-900 lg:text-5xl dark:text-white uppercase tracking-tight">
                        {t("home.testimonials.title")}
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-xs font-bold leading-relaxed text-slate-500 dark:text-slate-400">
                        {t("home.testimonials.subtitle")}
                    </p>
                </div>

                {/* MOBILE SLIDER */}
                <div className="mt-12 block md:hidden">
                    <div className="relative">
                        <article className="theme-news-card relative flex flex-col overflow-hidden rounded-[3rem] border bg-white p-8 dark:bg-slate-900 animate-in fade-in zoom-in duration-500">
                            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

                            <div className="relative flex flex-col items-center">
                                {/* Quote Content */}
                                <div className="min-h-[220px] text-center text-sm font-bold italic leading-relaxed text-slate-600 dark:text-slate-300">
                                    <span className="mb-4 block text-4xl text-emerald-500 opacity-20">&quot;</span>
                                    {data[activeIndex].quote.map((line, idx) => (
                                        <p key={idx} className="mb-4 last:mb-0">{line}</p>
                                    ))}
                                </div>

                                {/* Identity */}
                                <div className="mt-8 flex flex-col items-center border-t border-slate-100 pt-8 dark:border-white/5 w-full">
                                    <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-2xl ring-4 ring-emerald-500/10 dark:border-slate-800">
                                        <Image
                                            src={data[activeIndex].image}
                                            alt={data[activeIndex].name}
                                            width={80}
                                            height={80}
                                            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="mt-4 text-base font-black text-slate-900 dark:text-white tracking-tight">
                                        {data[activeIndex].name}
                                    </h3>
                                    <p className="mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                        {data[activeIndex].position}
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Navigation Buttons Mobile */}
                        <div className="mt-8 flex items-center justify-center gap-4">
                            {activeIndex > 0 ? (
                                <button
                                    onClick={prevPerson}
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200/50 text-slate-400 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none dark:hover:bg-emerald-500"
                                >
                                    <ChevronLeftIcon />
                                </button>
                            ) : (
                                <div className="w-12" /> // Placeholder agar dot tetap di tengah
                            )}

                            <div className="flex gap-2">
                                {data.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 bg-emerald-600" : "w-1.5 bg-slate-300 dark:bg-slate-700"}`}
                                    />
                                ))}
                            </div>

                            {activeIndex < data.length - 1 ? (
                                <button
                                    onClick={nextPerson}
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200/50 text-slate-400 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none dark:hover:bg-emerald-500"
                                >
                                    <ChevronRightIcon />
                                </button>
                            ) : (
                                <div className="w-12" /> // Placeholder
                            )}
                        </div>
                    </div>
                </div>

                {/* DESKTOP GRID */}
                <div className="mt-16 hidden md:grid md:grid-cols-3 gap-8">
                    {data.map((person, index) => (
                        <article
                            key={`${person.name}-${index}`}
                            className="theme-news-card group relative flex flex-col overflow-hidden rounded-[3rem] border bg-white p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900"
                        >
                            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl transition-all duration-700 group-hover:bg-emerald-500/15" />

                            <div className="relative flex flex-1 flex-col">
                                <div className="flex-1 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 text-justify">
                                    <span className="mb-4 block text-5xl text-emerald-500 opacity-10">&quot;</span>
                                    {person.quote.map((line, lineIndex) => (
                                        <p key={lineIndex} className="mb-4 last:mb-0">{line}</p>
                                    ))}
                                </div>

                                <div className="mt-10 flex flex-col items-center border-t border-slate-50 pt-10 dark:border-white/5">
                                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-2xl ring-8 ring-emerald-500/5 transition-transform duration-500 group-hover:scale-105 dark:border-slate-800">
                                        <Image
                                            src={person.image}
                                            alt={person.name}
                                            width={96}
                                            height={96}
                                            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="mt-6 text-center text-base font-black text-slate-900 dark:text-white tracking-tight">
                                        {person.name}
                                    </h3>
                                    <p className="mt-2 text-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                        {person.position}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
