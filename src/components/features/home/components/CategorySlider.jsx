import React, { useState, useEffect } from "react";
import Image from "next/image";

function resolveImage(value = "") {
    const raw = String(value || "").trim();
    return raw || "/assets/branding/kemenag.svg";
}

export default function CategorySlider({ slides = [], fallbackTitle, onSlideClick }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return undefined;
        const intervalId = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => window.clearInterval(intervalId);
    }, [slides.length]);

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        setIndex((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (slides.length === 0) {
        return (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                <div className="h-12 w-12 rounded-full bg-slate-100 p-3 text-slate-400 dark:bg-slate-800">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                    </svg>
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Segera Hadir</p>
            </div>
        );
    }

    const current = slides[index % slides.length];

    return (
        <>
            {/* MOBILE CAROUSEL */}
            <div className="lg:hidden relative overflow-hidden py-4 -mx-4 sm:-mx-10 mt-2">
                <div
                    className="flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
                    style={{ transform: `translateX(calc(50% - ${(index % slides.length) * 85 + 42.5}%))` }}
                >
                    {slides.map((item, i) => {
                        const isActive = i === (index % slides.length);
                        return (
                            <div
                                key={item.id || i}
                                className={`w-[85%] flex-none px-2 transition-all duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${isActive ? "scale-100 opacity-100 z-10" : "scale-[0.92] opacity-40 blur-[1px]"}`}
                            >
                                <div 
                                    className="relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-emerald-500/10 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 cursor-pointer"
                                    onClick={() => onSlideClick && onSlideClick(item)}
                                >
                                    <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden">
                                        <Image
                                            src={resolveImage(item.image_url)}
                                            alt={item.title || fallbackTitle}
                                            fill
                                            sizes="(max-width: 1024px) 85vw"
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                    </div>
                                    <div className="pt-5 pb-6 px-5 text-center">
                                        <h3 className="text-lg font-black leading-tight text-slate-900 dark:text-slate-100 line-clamp-2">
                                            {item.title}
                                        </h3>
                                        {item.caption && (
                                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                                {item.caption}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {slides.length > 1 && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none z-20">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-black/60 active:scale-95"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-black/60 active:scale-95"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* DESKTOP CARD */}
            <div 
                className="hidden lg:flex group relative h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-900 dark:ring-slate-800 cursor-pointer"
                onClick={() => onSlideClick && onSlideClick(current)}
            >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 dark:bg-slate-950">
                    <Image
                        key={current.id}
                        src={resolveImage(current.image_url)}
                        alt={current.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 16vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 animate-[fadeIn_700ms_ease-in-out]"
                        priority={index === 0}
                    />
                    {slides.length > 1 && (
                        <div className="absolute bottom-2 left-2 flex gap-1">
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all ${i === index % slides.length ? "w-4 bg-white" : "w-1 bg-white/40"}`}
                                />
                            ))}
                        </div>
                    )}
                    {slides.length > 1 && (
                        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20">
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-all hover:scale-110 hover:bg-black/60"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-all hover:scale-110 hover:bg-black/60"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-black leading-tight text-slate-900 dark:text-white">
                        {current.title}
                    </h3>
                    {current.caption && (
                        <p className="mt-2 line-clamp-3 text-[11px] leading-5 text-slate-600 dark:text-slate-400">
                            {current.caption}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
