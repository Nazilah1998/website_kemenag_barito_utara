import React from "react";

export function ActionBadge({ action }) {
  const tones = {
    create: "bg-emerald-500 text-white",
    update: "bg-sky-500 text-white",
    delete: "bg-rose-500 text-white",
    publish: "bg-amber-500 text-white",
    unpublish: "bg-slate-500 text-white",
    login: "bg-indigo-500 text-white",
    logout: "bg-slate-400 text-white",
    role_change: "bg-violet-500 text-white",
  };

  const cls = tones[action] || "bg-slate-900 text-white";

  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest italic shadow-sm ${cls}`}>
      {action}
    </span>
  );
}

export function AuditTable({ items, loading, onDelete, deletingId }) {
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-2xl border-4 border-slate-100 border-t-slate-900 dark:border-white/10 dark:border-t-white" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Sinkronisasi Log...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-300 dark:bg-white/5">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Riwayat Kosong</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-50 dark:border-white/5">
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Kronologi</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Aksi</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Entitas</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Ringkasan</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Pelaku</th>
              <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-50 dark:divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="group transition-all hover:bg-slate-50/50 dark:hover:bg-white/5">
                <td className="px-6 py-6 whitespace-nowrap">
                  <p className="text-[11px] font-black uppercase italic text-slate-900 dark:text-white">
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.created_at))}
                  </p>
                </td>
                <td className="px-6 py-6">
                  <ActionBadge action={item.action} />
                </td>
                <td className="px-6 py-6">
                  <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white italic">{item.entity}</p>
                  {item.entity_id && (
                    <p className="mt-1 text-[9px] font-bold text-slate-400 uppercase">ID: {String(item.entity_id).slice(0, 8)}</p>
                  )}
                </td>
                <td className="px-6 py-6 max-w-xs">
                  <p className="text-[11px] font-bold leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                    {item.summary || "-"}
                  </p>
                </td>
                <td className="px-6 py-6">
                  <p className="text-xs font-black uppercase italic text-slate-900 dark:text-white">{item.actor_email?.split('@')[0] || "System"}</p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">{item.actor_role || "SYSTEM"}</p>
                </td>
                <td className="px-6 py-6 text-right">
                  <button
                    onClick={() => onDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white dark:border-rose-900/20"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 lg:hidden">
        {items.map((item) => (
          <div key={item.id} className="relative overflow-hidden rounded-[2rem] border-2 border-slate-50 bg-white p-6 dark:border-white/5 dark:bg-slate-900/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <ActionBadge action={item.action} />
                  <span className="text-[9px] font-black uppercase italic tracking-widest text-slate-300 dark:text-slate-700">#{item.id.slice(0, 5)}</span>
                </div>
                <h4 className="mt-2 text-sm font-black uppercase italic text-slate-900 dark:text-white">{item.entity}</h4>
              </div>
              <button
                onClick={() => onDelete(item.id)}
                disabled={deletingId === item.id}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-900/20"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl mb-4">
              <p className="text-[11px] font-bold leading-relaxed text-slate-500 dark:text-slate-400 italic">
                {item.summary || "Tidak ada detail kronologi."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-slate-50 dark:border-white/5">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">Waktu</span>
                <span className="text-[10px] font-black uppercase italic text-slate-500 dark:text-slate-400">
                  {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}
                </span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">Oleh</span>
                <span className="text-[10px] font-black uppercase italic text-slate-900 dark:text-white leading-none">{item.actor_email?.split('@')[0] || "System"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuditPagination({ currentPage, totalPages, onPageChange }) {
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

export function AuditStats({ totalCount }) {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-8 shadow-2xl shadow-slate-200/50 transition-all duration-500 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Aktivitas Terarsip</p>
          <p className="mt-2 text-5xl font-black tracking-tight text-slate-900 dark:text-white">{totalCount}</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white dark:bg-white dark:text-black">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div className="relative z-10 mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 dark:border-slate-800/50">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Optimal & Terpantau</p>
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
