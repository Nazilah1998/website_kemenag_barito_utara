"use client";

import { useEffect } from "react";
import PageBanner from "@/components/common/PageBanner";
import Link from "next/link";

export default function BeritaError({ error, reset }) {
  useEffect(() => {
    console.error("Berita section error:", error);
  }, [error]);

  return (
    <>
      <PageBanner
        title="Terjadi Kesalahan"
        description="Maaf, kami tidak dapat memuat konten berita saat ini."
      />
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-6 py-20 dark:bg-slate-950">
        <div className="text-center max-w-md w-full">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <svg
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
            Gagal Memuat Berita
          </h2>
          <p className="mb-8 text-slate-600 dark:text-slate-400">
            Terjadi masalah saat mengambil data. Silakan coba muat ulang halaman atau kembali ke beranda.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Coba Muat Ulang
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
