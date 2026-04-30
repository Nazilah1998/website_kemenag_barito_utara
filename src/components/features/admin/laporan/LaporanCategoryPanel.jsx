// src/components/admin/laporan/LaporanCategoryPanel.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";

export default function LaporanCategoryPanel({
    categories = [],
    activeSlug,
    activeCategory,
    loadingSlug,
    onSwitchCategory,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <h3 className="mt-6 text-xl font-black tracking-tight text-slate-900 dark:text-white">Belum Ada Kategori</h3>
                <p className="mt-2 text-sm font-medium text-slate-400">Tambah kategori terlebih dahulu untuk mulai mengelola dokumen.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Database Dokumen</p>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                        {activeCategory?.title || "Kategori Dokumen"}
                    </h2>
                    <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 max-w-lg">
                        Kelola dan publikasikan berkas pelaporan resmi sesuai kategori yang dipilih.
                    </p>
                </div>

                {/* Modern Dropdown Selector */}
                <div className="relative w-full lg:w-[360px]" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`group flex w-full h-14 items-center justify-between rounded-2xl border-2 transition-all duration-300 ${isOpen
                            ? "border-slate-900 bg-white shadow-xl dark:border-white dark:bg-slate-900"
                            : "border-slate-100 bg-slate-50/50 hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-white"
                            }`}
                    >
                        <div className="flex items-center gap-4 px-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Pilih Kategori</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white truncate max-w-[180px]">
                                    {activeCategory?.title || "Pilih..."}
                                </p>
                            </div>
                        </div>
                        <div className={`mr-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="4">
                                <path d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-white dark:bg-slate-900">
                            <div className="max-h-[300px] overflow-y-auto p-3 custom-scrollbar">
                                {categories.map((cat) => {
                                    const isActive = activeSlug === cat.slug;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                onSwitchCategory(cat.slug);
                                                setIsOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-xl px-5 py-3.5 transition-all ${isActive
                                                ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                                }`}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">{cat.title}</span>
                                            {isActive && (
                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4">
                                                    <path d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50" />
        </div>
    );
}
