import React, { useState, useEffect } from "react";
import Image from "next/image";

function resolveImage(value = "") {
    const raw = String(value || "").trim();
    return raw || "/kemenag.svg";
}

export default function CategorySlider({ slides = [], fallbackTitle }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return undefined;
        const intervalId = window.setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => window.clearInterval(intervalId);
    }, [slides.length]);

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
                <p className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Segera Hadir</p>
            </div>
        );
    }

    const current = slides[index % slides.length];

    return (
        <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-900 dark:ring-slate-800">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 dark:bg-slate-950">
                <Image
                    key={current.id}
                    src={resolveImage(current.image_url)}
                    alt={current.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 animate-[fadeIn_700ms_ease-in-out]"
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
    );
}
