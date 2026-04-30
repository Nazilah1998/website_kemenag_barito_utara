import React, { useState } from "react";

export function StatCard({ label, value, helper, icon }) {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-8 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-slate-300/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
      <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-slate-800/50" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-600 transition-colors dark:group-hover:text-slate-300">
            {label}
          </p>
          <p className="mt-3 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white shadow-xl shadow-slate-900/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 dark:bg-white dark:text-black dark:shadow-none">
          {React.cloneElement(icon, { className: "w-7 h-7" })}
        </div>
      </div>
      <div className="relative z-10 mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 dark:border-slate-800/50">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {helper}
        </p>
      </div>
    </div>
  );
}

export function StatusPill({ published }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${published
        ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
        : "bg-amber-50 text-amber-600 border-2 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50"
        }`}
    >
      <div className={`h-2 w-2 rounded-full shadow-sm ${published ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
      {published ? "Tayang" : "Draft"}
    </span>
  );
}

export function ActionIconButton({
  title,
  onClick,
  children,
  variant = "neutral",
  disabled = false,
}) {
  const variantClasses = {
    neutral:
      "border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-white dark:hover:text-white",
    danger:
      "border-rose-100 bg-rose-50 text-rose-600 hover:border-rose-600 hover:bg-rose-600 hover:text-white dark:border-rose-900 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white",
    sky: "border-sky-100 bg-sky-50 text-sky-600 hover:border-sky-600 hover:bg-sky-600 hover:text-white dark:border-sky-900 dark:bg-slate-800 dark:text-sky-400 dark:hover:bg-sky-600 dark:hover:text-white",
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-all active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant] || variantClasses.neutral}`}
    >
      {React.cloneElement(children, { className: "w-4 h-4" })}
    </button>
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

export function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-900 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-white">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{label}</p>
        <p className="mt-1 text-[10px] font-medium text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-900/5 ${checked ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-slate-800"}`}
      >
        <span
          className={`h-6 w-6 rounded-full shadow-lg transition-all duration-300 ${checked ? "translate-x-7 bg-white dark:bg-slate-900" : "translate-x-1 bg-white dark:bg-slate-400"}`}
        />
      </button>
    </div>
  );
}

export function SlidePagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-8 sm:flex-row dark:border-slate-800/50">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Halaman <span className="text-slate-900 dark:text-white">{currentPage}</span> dari <span className="text-slate-900 dark:text-white">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-11 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-slate-900 hover:text-slate-900 disabled:opacity-30 dark:border-slate-800 dark:bg-transparent dark:hover:border-white dark:hover:text-white"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-11 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-slate-900 hover:text-slate-900 disabled:opacity-30 dark:border-slate-800 dark:bg-transparent dark:hover:border-white dark:hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
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
