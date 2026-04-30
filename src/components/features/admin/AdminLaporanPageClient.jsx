// src/components/features/admin/AdminLaporanPageClient.jsx
"use client";

import React, { useEffect, useState } from "react";
import AdminLaporanCategoryManager from "./AdminLaporanCategoryManager";

export default function AdminLaporanPageClient() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("/api/admin/laporan", {
                    method: "GET",
                    cache: "no-store",
                    credentials: "include",
                });

                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json?.message || "Gagal memuat data laporan admin.");
                }

                if (!isMounted) return;

                setCategories(Array.isArray(json?.categories) ? json.categories : []);
            } catch (err) {
                if (!isMounted) return;
                setError(err?.message || "Gagal memuat data laporan admin.");
                setCategories([]);
            } finally {
                if (!isMounted) return;
                setLoading(false);
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    const initialCategory = categories[0] || null;

    return (
        <section className="space-y-12 animate-in fade-in duration-700">
            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-600 dark:border-slate-800 dark:border-t-emerald-500" />
                    <p className="mt-6 text-sm font-black uppercase tracking-widest text-slate-400">Menginisialisasi Sistem...</p>
                </div>
            ) : error ? (
                <div className="rounded-[2.5rem] border border-rose-100 bg-rose-50/50 p-12 text-center dark:border-rose-900/30 dark:bg-rose-950/20">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400 mb-6">
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Terjadi Kesalahan</h2>
                    <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 rounded-2xl bg-slate-900 px-8 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-slate-200"
                    >
                        Coba Lagi
                    </button>
                </div>
            ) : (
                <AdminLaporanCategoryManager
                    category={initialCategory}
                    categories={categories}
                />
            )}
        </section>
    );
}
