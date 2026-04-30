import React, { useState } from "react";
import { IconCheckCircle, IconAlertCircle } from "./BeritaIcons";

export const statToneMap = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

export function StatCard({ label, value, helper, icon, tone = "emerald" }) {
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

export function CoverThumb({
  src,
  alt = "Preview gambar",
  className = "",
  fallbackText = "Belum ada gambar",
}) {
  const [failedSrc, setFailedSrc] = useState("");

  const showFallback = !src || failedSrc === src;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 ${className}`.trim()}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setFailedSrc(src)}
        className={`rounded-2xl object-cover ring-1 ring-slate-100 dark:ring-slate-800 ${className}`.trim()}
      />
    </>
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
        className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-900/5 ${checked ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-slate-800"
          }`}
      >
        <span
          className={`h-6 w-6 rounded-full shadow-lg transition-all duration-300 ${checked
            ? "translate-x-7 bg-white dark:bg-slate-900"
            : "translate-x-1 bg-white dark:bg-slate-400"
            }`}
        />
      </button>
    </div>
  );
}

export function ToolbarButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-900 hover:text-white active:scale-90 dark:text-slate-400 dark:hover:bg-white dark:hover:text-black"
    >
      {React.cloneElement(children, { className: "w-4.5 h-4.5" })}
    </button>
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
  const detail = isError
    ? error
    : String(message || "")
      .replace(/\s*Ukuran[^.]*\.?/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

  return (
    <div className="pointer-events-none fixed right-3 top-24 z-70 flex w-[min(92vw,380px)] flex-col items-end gap-3 sm:right-6">
      <div
        className={`pointer-events-auto w-full overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-8 duration-500 ${isError
          ? "border-rose-100 bg-white/95 text-rose-700 dark:border-rose-900/70 dark:bg-slate-900/95 dark:text-rose-300"
          : "border-emerald-100 bg-white/95 text-emerald-700 dark:border-emerald-900/70 dark:bg-slate-900/95 dark:text-emerald-300"
          }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-4 px-6 py-5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] ${isError
              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
              }`}
          >
            {isError ? <IconAlertCircle /> : <IconCheckCircle />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-base font-black tracking-tight">{title}</p>
            <p className="mt-1 text-sm font-medium leading-relaxed opacity-70">
              {detail}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:bg-slate-950/5 active:scale-90`}
            aria-label="Tutup notifikasi"
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

export function ModernSelect({ label, value, options = [], onChange, name }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`mt-1.5 flex h-12 w-full items-center justify-between rounded-2xl border bg-white px-5 text-sm font-bold text-slate-900 outline-none transition-all dark:bg-slate-800/50 dark:text-white ${isOpen
          ? "border-slate-900 ring-4 ring-slate-900/5 dark:border-white dark:ring-white/5"
          : "border-slate-200 dark:border-slate-800"
          }`}
      >
        <span>{value || "Pilih..."}</span>
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-[200] mt-2 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 dark:border-slate-800 dark:bg-slate-900">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange({ target: { name, value: opt } });
                setIsOpen(false);
              }}
              className={`w-full rounded-xl px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all ${value === opt
                ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
