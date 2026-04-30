import React from "react";

export function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/50",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/50",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/50",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/50",
    violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/50",
  };

  return (
    <span className={`inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  tone = "primary",
  size = "md",
  className = "",
  loading = false,
  icon,
  ...props
}) {
  const tones = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 dark:bg-white dark:text-black dark:hover:bg-slate-200",
    ghost: "border-2 border-slate-100 bg-white text-slate-900 hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-white dark:hover:text-white",
    danger: "bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white",
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
      className={`group inline-flex items-center justify-center gap-3 rounded-2xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${sizes[size]} ${className}`.trim()}
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

export function IconButton({
  label,
  icon,
  onClick,
  disabled = false,
  tone = "slate",
  loading = false,
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 dark:hover:bg-emerald-600 dark:hover:text-white",
    rose: "bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50 dark:hover:bg-rose-600 dark:hover:text-white",
    slate: "bg-white text-slate-900 border-2 border-slate-100 hover:border-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:border-white dark:hover:text-white",
    blue: "bg-blue-50 text-blue-600 border-2 border-blue-100 hover:bg-blue-600 hover:text-white dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50 dark:hover:bg-blue-600 dark:hover:text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`group flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${loading ? "animate-pulse" : ""}`}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span className="scale-110 transition-transform group-hover:scale-125">{icon}</span>
      )}
    </button>
  );
}

export function FilterButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 items-center justify-center rounded-2xl px-8 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 ${active
        ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10 dark:bg-white dark:text-black"
        : "bg-white text-slate-400 border-2 border-slate-100 hover:border-slate-900 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-white dark:hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}
