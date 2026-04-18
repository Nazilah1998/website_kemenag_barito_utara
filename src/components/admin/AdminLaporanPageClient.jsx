"use client";

import { useEffect, useState } from "react";
import AdminLaporanCategoryManager from "@/components/admin/AdminLaporanCategoryManager";

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
        <section className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">
                    Modul Laporan
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Manajemen Dokumen Laporan
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Kelola kategori, upload dokumen PDF, ubah metadata, dan atur publikasi
                    dokumen laporan instansi secara terpusat.
                </p>
            </div>

            {loading ? (
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Memuat data kategori laporan…
                    </p>
                </section>
            ) : error ? (
                <section className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 shadow-sm dark:border-rose-900 dark:bg-rose-950/30">
                    <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                        {error}
                    </p>
                </section>
            ) : (
                <AdminLaporanCategoryManager
                    category={initialCategory}
                    categories={categories}
                />
            )}
        </section>
    );
}