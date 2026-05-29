"use client";

import { useEffect } from "react";
import { logError } from "@/lib/logger";

export default function AdminErrorBoundary({ error, reset }) {
  useEffect(() => {
    logError("admin_error_boundary", {
      error: error?.message,
      name: error?.name,
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-2xl">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
            <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
            Terjadi Kesalahan
          </h2>

          <p className="mt-3 text-center text-sm leading-relaxed text-slate-400">
            Panel admin mengalami gangguan saat memproses halaman ini.
            Silakan coba lagi atau hubungi pengembang jika masalah berlanjut.
          </p>

          {/* Error detail (dev only) */}
          {process.env.NODE_ENV === "development" && error?.message && (
            <div className="mt-6 rounded-2xl bg-slate-950 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Detail Error
              </p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-red-300">
                {error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => reset()}
              className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
            >
              Coba Lagi
            </button>

            <a
              href="/admin"
              className="flex-1 rounded-xl border border-slate-700 px-5 py-3 text-center text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              Kembali ke Dashboard
            </a>
          </div>

          <p className="mt-6 text-center text-[10px] font-medium uppercase tracking-widest text-slate-600">
            Error telah dicatat untuk ditindaklanjuti
          </p>
        </div>
      </div>
    </div>
  );
}
