"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function EmptyState() {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">
                Galeri
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Belum ada item galeri
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                Item galeri akan tampil di halaman ini setelah berita dikirim dari panel
                admin ke galeri.
            </p>
        </div>
    );
}

function GalleryCard({ item, onOpen }) {
    return (
        <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <button
                type="button"
                onClick={onOpen}
                className="block w-full cursor-zoom-in text-left"
                title="Lihat gambar"
            >
                <div className="relative aspect-3/4 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        loading="lazy"
                        decoding="async"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent" />

                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-slate-100">
                        Lihat gambar
                    </div>
                </div>
            </button>

            <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {formatDate(item.publishedAt)}
                </p>

                <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-6 text-slate-900 dark:text-slate-100">
                    {item.title}
                </h3>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onOpen}
                        className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                        Preview
                    </button>

                    {item.linkUrl ? (
                        <Link
                            href={item.linkUrl}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                            Buka berita
                            <span aria-hidden="true">â†’</span>
                        </Link>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

function LightboxButton({ onClick, label, children, className = "" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur-md transition hover:bg-white/20 ${className}`}
        >
            {children}
        </button>
    );
}

export default function GaleriPageClient({ items = [] }) {
    const safeItems = useMemo(() => {
        if (!Array.isArray(items)) return [];
        return items.filter(Boolean);
    }, [items]);

    const [selectedIndex, setSelectedIndex] = useState(-1);

    const selectedItem = useMemo(() => {
        if (selectedIndex < 0 || selectedIndex >= safeItems.length) return null;
        return safeItems[selectedIndex];
    }, [safeItems, selectedIndex]);

    const handleClose = useCallback(() => {
        setSelectedIndex(-1);
    }, []);

    const handlePrev = useCallback(() => {
        if (safeItems.length <= 1) return;

        setSelectedIndex((current) => {
            if (current <= 0) return safeItems.length - 1;
            return current - 1;
        });
    }, [safeItems.length]);

    const handleNext = useCallback(() => {
        if (safeItems.length <= 1) return;

        setSelectedIndex((current) => {
            if (current >= safeItems.length - 1) return 0;
            return current + 1;
        });
    }, [safeItems.length]);

    useEffect(() => {
        if (!selectedItem) {
            document.body.style.overflow = "";
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (event) => {
            if (event.key === "Escape") handleClose();
            if (event.key === "ArrowLeft") handlePrev();
            if (event.key === "ArrowRight") handleNext();
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [selectedItem, handleClose, handlePrev, handleNext]);

    return (
        <>
            <section className="w-full px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">
                            Dokumentasi
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                            Galeri Kegiatan
                        </h1>

                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 md:text-base dark:text-slate-300">
                            Kumpulan dokumentasi visual yang terhubung langsung ke berita dan
                            publikasi resmi.
                        </p>
                    </div>

                    <div className="w-fit rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                            Total item
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {safeItems.length}
                        </p>
                    </div>
                </div>

                {safeItems.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {safeItems.map((item, index) => (
                            <GalleryCard
                                key={item.id ?? index}
                                item={item}
                                onOpen={() => setSelectedIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {selectedItem ? (
                <div
                    className="fixed inset-0 z-[200] bg-slate-950/92 backdrop-blur-md"
                    onClick={handleClose}
                >
                    <div className="relative flex min-h-screen items-center justify-center p-3 sm:p-6">
                        <div
                            className="relative flex h-[94vh] w-full max-w-7xl items-center justify-center"
                            onClick={(event) => event.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Preview galeri"
                        >
                            <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md sm:left-6 sm:top-6">
                                {selectedIndex + 1} / {safeItems.length}
                            </div>

                            <div className="absolute right-3 top-3 z-20 sm:right-6 sm:top-6">
                                <LightboxButton onClick={handleClose} label="Tutup preview">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </LightboxButton>
                            </div>

                            {safeItems.length > 1 ? (
                                <>
                                    <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2 sm:left-6">
                                        <LightboxButton onClick={handlePrev} label="Gambar sebelumnya">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <polyline points="15 18 9 12 15 6" />
                                            </svg>
                                        </LightboxButton>
                                    </div>

                                    <div className="absolute right-3 top-1/2 z-20 -translate-y-1/2 sm:right-6">
                                        <LightboxButton onClick={handleNext} label="Gambar berikutnya">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </LightboxButton>
                                    </div>
                                </>
                            ) : null}

                            <div className="flex h-full w-full items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedItem.imageUrl}
                                    alt={selectedItem.title}
                                    className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl sm:rounded-3xl"
                                    loading="eager"
                                    decoding="async"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
