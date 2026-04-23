"use client";

import { useEffect, useMemo, useState } from "react";

function ChevronLeftIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

function resolveImage(value = "") {
    const raw = String(value || "").trim();
    return raw || "/kemenag.svg";
}

export default function HomepageSlidesSection({ slides = [] }) {
    const normalizedSlides = useMemo(
        () =>
            Array.isArray(slides)
                ? slides.filter((item) => item?.image_url && item?.title)
                : [],
        [slides],
    );

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (normalizedSlides.length <= 1) return undefined;

        const intervalId = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % normalizedSlides.length);
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, [normalizedSlides.length]);

    if (normalizedSlides.length === 0) return null;

    const safeActiveIndex = activeIndex % normalizedSlides.length;
    const current = normalizedSlides[safeActiveIndex];

    function prevSlide() {
        setActiveIndex((prev) =>
            prev === 0 ? normalizedSlides.length - 1 : prev - 1,
        );
    }

    function nextSlide() {
        setActiveIndex((prev) => (prev + 1) % normalizedSlides.length);
    }

    return (
        <section className="w-full px-6 py-14 sm:px-10 lg:px-16 xl:px-20">
            <div className="mx-auto max-w-5xl">
                <div className="relative overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={resolveImage(current.image_url)}
                        alt={current.title || "Slide beranda"}
                        className="mx-auto h-[320px] w-auto max-w-full object-contain sm:h-[420px] lg:h-[520px]"
                    />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            {safeActiveIndex + 1} / {normalizedSlides.length}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={prevSlide}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
                                aria-label="Slide sebelumnya"
                            >
                                <ChevronLeftIcon />
                            </button>
                            <button
                                type="button"
                                onClick={nextSlide}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
                                aria-label="Slide berikutnya"
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-700 dark:text-emerald-300">
                        Slider Beranda
                    </p>
                    <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900 dark:text-slate-100">
                        {current.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {current.caption || "Informasi terbaru dari Kemenag Barito Utara."}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {normalizedSlides.map((item, index) => (
                            <button
                                key={item.id || `${item.title}-${index}`}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`h-2.5 rounded-full transition-all ${index === safeActiveIndex
                                    ? "w-8 bg-emerald-600"
                                    : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
                                    }`}
                                aria-label={`Pilih slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
