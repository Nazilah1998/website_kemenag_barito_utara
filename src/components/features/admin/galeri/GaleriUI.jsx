import React from "react";

export function FloatingFeedback({ message, error, onClose }) {
  if (!message && !error) return null;

  return (
    <div className="fixed bottom-10 left-1/2 z-[200] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className={`flex items-center gap-4 rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-md ${error ? "bg-rose-600/90 text-white" : "bg-emerald-600/90 text-white"
        }`}>
        <p className="text-xs font-black uppercase tracking-widest">{error || message}</p>
        <button onClick={onClose} className="rounded-full bg-white/20 p-1 hover:bg-white/30 transition-colors">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function GaleriPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("...");
      }
    }
    
    pages = pages.filter((item, index) => item !== "..." || pages[index - 1] !== "...");

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={`dots-${index}`} className="px-2 text-slate-400 font-bold tracking-widest">
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-[10px] sm:text-[11px] font-black transition-all ${
            currentPage === page
              ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:shadow-none scale-110"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="mt-8 flex flex-row items-center justify-center gap-2 sm:gap-4 border-t border-slate-100 pt-6 sm:pt-8 dark:border-slate-800/50">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="group flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900"
        aria-label="Previous Page"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex items-center gap-1 sm:gap-2">
        {renderPageNumbers()}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="group flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900"
        aria-label="Next Page"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export function DeleteConfirmModal({ open, onConfirm, onCancel, loading, title, description }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl border-2 border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:border-white/5"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-12 rounded-xl bg-rose-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
