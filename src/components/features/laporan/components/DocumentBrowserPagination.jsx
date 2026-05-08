import React from "react";

export function DocumentBrowserPagination({ current, total, onPageChange }) {
  if (total <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <PageButton onClick={() => onPageChange(current - 1)} disabled={current === 1} label="Sebelumnya">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
      </PageButton>

      {Array.from({ length: total }, (_, i) => i + 1).map((num) => (
        <button
          key={num} type="button" onClick={() => onPageChange(num)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition ${
            current === num
              ? "bg-emerald-600 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          {num}
        </button>
      ))}

      <PageButton onClick={() => onPageChange(current + 1)} disabled={current === total} label="Berikutnya">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
      </PageButton>
    </div>
  );
}

function PageButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  );
}
