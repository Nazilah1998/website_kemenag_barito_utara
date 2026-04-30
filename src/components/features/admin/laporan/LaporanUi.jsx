// src/components/admin/laporan/LaporanUi.jsx
"use client";

import React from "react";

export function Button({
  children,
  tone = "primary",
  size = "md",
  className = "",
  loading = false,
  loadingText = "Memproses...",
  icon,
  ...props
}) {
  const tones = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 dark:bg-white dark:text-black dark:hover:bg-slate-200 dark:shadow-none",
    ghost: "border-2 border-slate-200 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-white dark:hover:text-white",
    danger: "bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white",
    soft: "bg-slate-100 text-slate-900 border-2 border-slate-100 hover:border-slate-900 hover:bg-white dark:bg-slate-800 dark:text-slate-400 dark:hover:border-white dark:hover:text-white",
    success: "bg-emerald-50 text-emerald-700 border-2 border-emerald-100 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white",
  };

  const sizes = {
    sm: "h-10 px-5 text-[10px] font-black uppercase tracking-widest",
    md: "h-12 px-8 text-[11px] font-black uppercase tracking-widest",
    lg: "h-14 px-10 text-xs font-black uppercase tracking-widest",
  };

  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`group inline-flex items-center justify-center gap-3 rounded-2xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone] || tones.primary} ${sizes[size] || sizes.md} ${className}`.trim()}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {icon && <span className="shrink-0 scale-110">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export function Input({ label, hint, error, inputId, required, ...props }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <label htmlFor={inputId} className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
        {error && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{error}</span>}
      </div>
      <input
        {...props}
        id={inputId}
        className={`w-full h-14 rounded-2xl border-2 bg-slate-50/50 px-6 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:border-white dark:focus:ring-white/5 ${error ? "border-rose-400 bg-rose-50/30 dark:border-rose-800" : "border-slate-100 dark:border-slate-800"
          } ${props.className || ""}`.trim()}
      />
      {hint && !error && (
        <p className="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Textarea({ label, hint, error, inputId, required, ...props }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <label htmlFor={inputId} className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
        {error && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{error}</span>}
      </div>
      <textarea
        {...props}
        id={inputId}
        className={`w-full min-h-[140px] rounded-2xl border-2 bg-slate-50/50 p-6 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:border-white dark:focus:ring-white/5 ${error ? "border-rose-400 bg-rose-50/30 dark:border-rose-800" : "border-slate-100 dark:border-slate-800"
          } ${props.className || ""}`.trim()}
      />
      {hint && !error && (
        <p className="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Feedback({ type, message }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div className={`flex items-center gap-4 rounded-[1.5rem] border-2 p-5 animate-in slide-in-from-top-2 duration-300 ${isError
      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
      }`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${isError ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
        }`}>
        {isError ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
        )}
      </div>
      <p className="text-[11px] font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}

export function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-400",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100/50",
    warn: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-100/50",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-100/50",
  };

  return (
    <span className={`inline-flex items-center rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] ${tones[tone] || tones.default}`}>
      {children}
    </span>
  );
}

export function DeleteConfirmModal({ open, onConfirm, onCancel, title, description, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onCancel} />

      <div className="relative w-full max-w-sm animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500 shadow-xl shadow-rose-500/10 dark:bg-rose-950/20">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{title || "Hapus Data?"}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            {description || "Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan?"}
          </p>

          <div className="mt-10 flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex h-14 items-center justify-center rounded-2xl bg-rose-600 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Menghapus..." : "Ya, Hapus Sekarang"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex h-14 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white text-[11px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-slate-900 hover:text-slate-900 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:bg-transparent dark:hover:border-white dark:hover:text-white"
            >
              Batalkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FloatingFeedback({ message, error, onClose }) {
  if (!message && !error) return null;

  const isError = Boolean(error);
  const title = isError ? "Terjadi kendala" : "Berhasil";
  const detail = isError ? error : message;

  return (
    <div className="pointer-events-none fixed right-3 top-24 z-[200] flex w-[min(92vw,380px)] flex-col items-end gap-3 sm:right-6">
      <div
        className={`pointer-events-auto w-full overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-8 duration-500 ${isError
          ? "border-rose-100 bg-white/95 text-rose-700 dark:border-rose-900/70 dark:bg-slate-900/95 dark:text-rose-300"
          : "border-emerald-100 bg-white/95 text-emerald-700 dark:border-emerald-900/70 dark:bg-slate-900/95 dark:text-emerald-300"
          }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-4 px-6 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-base font-black tracking-tight">{title}</p>
            <p className="mt-1 text-sm font-medium leading-relaxed opacity-70">
              {detail}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:bg-slate-950/5 active:scale-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
