import React from "react";

export function EyeIcon({ isOpen = false }) {
  const path = isOpen
    ? "M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 16.11 1 12c.92-2.18 2.36-4.01 4.16-5.36 M10.58 10.58A2 2 0 1 0 13.41 13.41 M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 2.89 11 7a11.05 11.05 0 0 1-1.68 2.75 M1 1l22 22"
    : "M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0 M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
      {!isOpen && <circle cx="12" cy="12" r="3" />}
    </svg>
  );
}

export function inputClassName(hasTrailingButton = false) {
  return [
    "w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 py-3.5",
    "text-sm font-bold text-slate-900 outline-none transition-all",
    "placeholder:text-slate-300",
    "focus:border-slate-900 focus:bg-white dark:border-white/5 dark:bg-white/5 dark:text-white dark:focus:border-white",
    hasTrailingButton ? "pr-14" : "",
  ].filter(Boolean).join(" ");
}

export function LoginLoading() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-[400px] rounded-[2.5rem] border-2 border-white bg-white/80 p-12 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-500 dark:border-white/5 dark:bg-slate-900/80">
        <div className="relative mx-auto mb-8 h-16 w-16">
          <div className="absolute inset-0 rounded-2xl border-4 border-slate-100 dark:border-white/5" />
          <div className="absolute inset-0 animate-spin rounded-2xl border-4 border-slate-900 border-t-transparent dark:border-white dark:border-t-transparent" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
          Security Check
        </p>
        <p className="mt-2 text-sm font-black text-slate-900 dark:text-white uppercase italic">
          Memverifikasi Sesi...
        </p>
      </div>
    </section>
  );
}
