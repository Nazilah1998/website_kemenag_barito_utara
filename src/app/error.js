"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] w-full items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
      <section className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            Terjadi Kesalahan
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Maaf, halaman ini sedang mengalami gangguan
          </h1>

          <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
            Sistem tidak dapat memproses permintaan Anda untuk sementara waktu.
            Silakan coba muat ulang halaman, kembali ke beranda, atau buka menu lain.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => reset()}
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Coba Lagi
            </button>

            <Link
              href="/"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Kembali ke Beranda
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold text-slate-900">Muat Ulang</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tekan tombol Coba Lagi untuk mencoba render ulang halaman.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold text-slate-900">Navigasi Aman</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Anda tetap bisa berpindah ke halaman lain lewat menu utama.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold text-slate-900">Pelaporan</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Error dicatat di console agar lebih mudah ditelusuri saat pengembangan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}