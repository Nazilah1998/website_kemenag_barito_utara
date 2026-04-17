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
        <main className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">
                Manajemen Dokumen Laporan
            </h1>

            {loading ? (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-600">
                        Memuat data kategori laporan…
                    </p>
                </section>
            ) : error ? (
                <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-rose-700">{error}</p>
                </section>
            ) : (
                <AdminLaporanCategoryManager
                    category={initialCategory}
                    categories={categories}
                />
            )}
        </main>
    );
}