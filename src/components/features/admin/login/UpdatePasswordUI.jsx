import React from "react";

export function EyeIcon({ isOpen = false }) {
  if (isOpen) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 16.11 1 12c.92-2.18 2.36-4.01 4.16-5.36" />
        <path d="M10.58 10.58A2 2 0 1 0 13.41 13.41" />
        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 2.89 11 7a11.05 11.05 0 0 1-1.68 2.75" />
        <path d="M1 1l22 22" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function PasswordInput({ label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"} value={value} onChange={onChange}
          placeholder={placeholder} required
          className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-slate-900 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-900/80 dark:focus:border-emerald-500 pr-12"
        />
        <button
          type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-black"
        >
          <EyeIcon isOpen={show} />
        </button>
      </div>
    </div>
  );
}
