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
    const data = [rawData[0], rawData[2], rawData[1]];

    const [activeIndex, setActiveIndex] = useState(1); // Default to Arbaja

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
        <section className="py-8 lg:py-12 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
                <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400">
                        ZONA INTEGRITAS
                    </p>
                    <h2 className="mt-2 text-2xl font-black leading-none text-slate-900 lg:text-4xl dark:text-white uppercase tracking-tight">
                        {t("home.testimonials.title")}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-[10px] font-bold leading-relaxed text-slate-500 dark:text-slate-400 sm:text-xs">
                        {t("home.testimonials.subtitle")}
                    </p>
                </div>

                {/* MOBILE SLIDER */}
                <div className="mt-8 block md:hidden">
                    <div className="relative">
                        <article className="theme-news-card relative flex flex-col overflow-hidden rounded-[2.5rem] border bg-white p-6 dark:bg-slate-900 animate-in fade-in zoom-in duration-500">
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-3xl" />

                            <div className="relative flex flex-col items-center">
                                {/* Quote Content */}
                                <div className="min-h-[160px] text-center text-xs font-bold italic leading-relaxed text-slate-600 dark:text-slate-300">
                                    <span className="mb-2 block text-3xl text-emerald-500 opacity-20">&quot;</span>
                                    {data[activeIndex].quote.map((line, idx) => (
                                        <p key={idx} className="mb-2 last:mb-0">{line}</p>
                                    ))}
                                </div>

                                {/* Identity */}
                                <div className="mt-6 flex flex-col items-center border-t border-slate-100 pt-6 dark:border-white/5 w-full">
                                    <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-xl ring-4 ring-emerald-500/10 dark:border-slate-800">
                                        <Image
                                            src={data[activeIndex].image}
                                            alt={data[activeIndex].name}
                                            width={64}
                                            height={64}
                                            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="mt-3 text-sm font-black text-slate-900 dark:text-white tracking-tight">
                                        {data[activeIndex].name}
                                    </h3>
                                    <p className="mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                        {data[activeIndex].position}
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Navigation Buttons Mobile */}
                        <div className="mt-6 flex items-center justify-center gap-4">
                            {activeIndex > 0 ? (
                                <button
                                    onClick={prevPerson}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg shadow-slate-200/50 text-slate-400 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none dark:hover:bg-emerald-500"
                                >
                                    <ChevronLeftIcon />
                                </button>
                            ) : (
                                <div className="w-10" />
                            )}

                            <div className="flex gap-1.5">
                                {data.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-emerald-600" : "w-1 bg-slate-300 dark:bg-slate-700"}`}
                                    />
                                ))}
                            </div>

                            {activeIndex < data.length - 1 ? (
                                <button
                                    onClick={nextPerson}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg shadow-slate-200/50 text-slate-400 transition hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:shadow-none dark:hover:bg-emerald-500"
                                >
                                    <ChevronRightIcon />
                                </button>
                            ) : (
                                <div className="w-10" />
                            )}
                        </div>
                    </div>
                </div>

                {/* DESKTOP PREMIUM GRID */}
                <div className="mt-12 hidden md:grid md:grid-cols-3 gap-6">
                    {data.map((person, index) => {
                        const isCenter = index === 1;
                        return (
                            <article
                                key={`${person.name}-${index}`}
                                className={`group relative flex flex-col overflow-hidden rounded-none border p-6 lg:p-8 transition-all duration-500 hover:-translate-y-2 ${isCenter
                                        ? "bg-white border-emerald-200 shadow-[0_25px_50px_rgba(16,185,129,0.1)] dark:bg-slate-900 dark:border-emerald-500/30 z-10"
                                        : "bg-white/60 border-slate-100 shadow-lg dark:bg-slate-900/40 dark:border-slate-800"
                                    }`}
                            >
                                {/* Decorative Glow */}
                                <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-all duration-700 ${isCenter ? "bg-emerald-500/10 group-hover:bg-emerald-500/20" : "bg-emerald-500/5 group-hover:bg-emerald-500/10"
                                    }`} />

                                {/* Quote Decoration */}
                                <div className="absolute top-4 left-4 text-5xl font-serif text-emerald-500/10 leading-none pointer-events-none select-none">
                                    &ldquo;
                                </div>

                                <div className="relative flex flex-1 flex-col">
                                    <div className="flex-1 text-[11px] lg:text-[12px] font-medium leading-relaxed text-slate-600 dark:text-slate-300 text-justify relative z-10">
                                        <div className="mb-6 h-0.5 w-8 bg-emerald-500/20 rounded-full" />
                                        {person.quote.map((line, lineIndex) => (
                                            <p key={lineIndex} className="mb-4 last:mb-0 italic leading-relaxed">
                                                {line}
                                            </p>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex flex-col items-center border-t border-slate-50 pt-6 dark:border-white/5">
                                        {/* Avatar with Premium Ring */}
                                        <div className="relative">
                                            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-xl ring-1 ring-slate-100 transition-all duration-500 group-hover:scale-105 group-hover:ring-emerald-500/30 dark:border-slate-800 dark:ring-slate-700">
                                                <Image
                                                    src={person.image}
                                                    alt={person.name}
                                                    width={64}
                                                    height={64}
                                                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            {isCenter && (
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-2 py-0.5 text-[7px] font-black uppercase tracking-widest text-white shadow-lg">
                                                    Official
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="mt-4 text-center text-xs font-black text-slate-900 dark:text-white tracking-tight">
                                            {person.name}
                                        </h3>
                                        <div className="mt-1 flex flex-col items-center gap-0.5">
                                            <p className="text-center text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                                {person.position}
                                            </p>
                                            <div className="h-0.5 w-6 bg-emerald-500/10 rounded-full group-hover:w-10 transition-all duration-500" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
