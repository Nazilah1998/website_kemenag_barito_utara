"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-100 text-slate-800">
        <main className="flex min-h-screen w-full items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
          <section className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              System Error
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              Aplikasi mengalami gangguan serius
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Terjadi error pada level aplikasi. Silakan coba muat ulang atau
              kembali beberapa saat lagi.
            </p>

            <div className="mt-8">
              <button
                onClick={() => reset()}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Coba Pulihkan Aplikasi
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}