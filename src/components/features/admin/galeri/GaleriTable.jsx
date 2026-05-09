import React from "react";
import Image from "next/image";

export function GaleriTable({ items, loading, onEdit, onDelete, deletingId }) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-white" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Memuat Koleksi Galeri...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-100 bg-white/50 p-12 text-center dark:border-slate-800/50 dark:bg-slate-900/30">
        <div className="mb-4 rounded-2xl bg-slate-50 p-4 text-slate-300 dark:bg-slate-800/50">
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Galeri Kosong</h3>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Mulai unggah visual untuk koleksi galeri instansi.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => (
        <article key={item.id} className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <Image
            src={item.image_url}
            alt="Gallery Item"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          {/* Actions Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  {new Date(item.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow-xl transition hover:bg-emerald-500 hover:text-white dark:bg-slate-800 dark:text-white dark:hover:bg-emerald-600"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  disabled={deletingId === item.id}
                  onClick={() => onDelete(item)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-rose-600 shadow-xl transition hover:bg-rose-600 hover:text-white disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-rose-600"
                >
                  {deletingId === item.id ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
