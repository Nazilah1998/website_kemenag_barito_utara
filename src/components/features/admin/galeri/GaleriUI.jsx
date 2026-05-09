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

  return (
    <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800/50">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Halaman <span className="text-slate-900 dark:text-white">{currentPage}</span> dari {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-900 transition hover:bg-slate-50 disabled:opacity-30 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        >
          Prev
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-900 transition hover:bg-slate-50 disabled:opacity-30 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        >
          Next
        </button>
      </div>
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
