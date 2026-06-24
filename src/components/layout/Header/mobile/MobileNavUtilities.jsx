import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

export function MobileNavUtilities({
  locale, setLocale,
  theme, setLightTheme, setDarkTheme,
  adminState
}) {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div className="mt-auto border-t border-slate-100/50 p-6 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
      <div className="grid grid-cols-2 gap-4">
        {/* Language Switcher */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Bahasa</p>
          <div className="flex items-center gap-1 rounded-[1.25rem] bg-slate-100/50 p-1 shadow-inner dark:bg-slate-800/50">
            {["id", "en"].map((l) => (
              <button
                key={l} onClick={() => setLocale(l)}
                className={`flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${locale === l ? "bg-white text-emerald-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-slate-700 dark:text-emerald-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Switcher */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tema</p>
          <div className="flex items-center gap-1 rounded-[1.25rem] bg-slate-100/50 p-1 shadow-inner dark:bg-slate-800/50">
            <button
              onClick={setLightTheme}
              className={`group flex-1 flex justify-center rounded-xl py-2.5 transition-all duration-300 ${theme === "light" ? "bg-white text-amber-500 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-slate-700" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
              aria-label="Light Mode"
            >
              <SunIcon className={`h-4 w-4 transition-transform duration-500 ${theme === "light" ? "rotate-90 scale-110" : "group-hover:rotate-45"}`} />
            </button>
            <button
              onClick={setDarkTheme}
              className={`group flex-1 flex justify-center rounded-xl py-2.5 transition-all duration-300 ${theme === "dark" ? "bg-white text-indigo-500 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-slate-700 dark:text-indigo-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
              aria-label="Dark Mode"
            >
              <MoonIcon className={`h-4 w-4 transition-transform duration-500 ${theme === "dark" ? "-rotate-12 scale-110" : "group-hover:-rotate-12"}`} />
            </button>
          </div>
        </div>
      </div>

      <MobileAdminLoginButton adminState={adminState} />
    </div>
    </>
  );
}

function MobileAdminLoginButton({ adminState }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

    if (adminState?.user) {
        return (
            <Link
                href="/admin"
                className="group relative mt-6 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-[1.25rem] bg-emerald-600 px-4 py-4 text-sm font-black text-white shadow-[0_8px_20px_-6px_rgba(5,150,105,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_-8px_rgba(5,150,105,0.6)] active:scale-[0.98] dark:shadow-none"
            >
                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                <div className="relative z-10 flex h-2 w-2 items-center justify-center">
                    <div className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-200 opacity-75" />
                    <div className="relative h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <span className="relative z-10">Panel Admin</span>
            </Link>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="group relative mt-6 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-[1.25rem] bg-emerald-600 px-4 py-4 text-sm font-black text-white shadow-[0_8px_20px_-6px_rgba(5,150,105,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_-8px_rgba(5,150,105,0.6)] active:scale-[0.98] dark:shadow-none"
            >
                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                <div className="relative z-10 flex h-2 w-2 items-center justify-center">
                    <div className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-200 opacity-75" />
                    <div className="relative h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <span className="relative z-10">Login Admin</span>
            </button>

      {/* Confirmation Modal via Portal */}
      {mounted && typeof document !== "undefined" && createPortal(
        <div className={`fixed inset-0 z-[99999] transition-all duration-300 ${showConfirm ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-300 ${showConfirm ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            />

            {/* Modal Panel */}
            <div
              className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-200/50 dark:bg-slate-900/95 dark:ring-white/10 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
            >
              {/* Top red warning accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 w-full bg-red-500" />

              <div className="relative p-7 z-10">
                <div className="flex flex-col items-center text-center">
                  {/* Clean Warning Icon */}
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-8 w-8 text-red-600 dark:text-red-400"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Peringatan Akses
                  </h3>

                  <div className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    <p>Halaman ini dikhususkan bagi</p>
                    <p className="font-bold text-red-600 dark:text-red-400">Admin Kemenag Barito Utara.</p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white py-3.5 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-white/20 active:scale-95"
                  >
                    Kembali
                  </button>
                  <Link
                    href="/admin"
                    onClick={() => setShowConfirm(false)}
                    className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 py-3.5 text-center text-[11px] font-black uppercase tracking-widest text-white transition-all hover:shadow-[0_8px_20px_-6px_rgba(225,29,72,0.5)] active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Ya, Masuk
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                    <div className="absolute inset-0 bg-white/20 transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
                  </Link>
                </div>
              </div>
            </div>
            </div>
          </div>,
        document.body
      )}
    </>
  );
}

function SunIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
