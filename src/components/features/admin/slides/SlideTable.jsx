import React from "react";
import { StatusPill, ActionIconButton } from "./SlidesUI";
import Image from "next/image";

export function SlideTable({ items, loading, onEdit, onDelete, deletingId, toNumber }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-12 w-12 animate-spin rounded-2xl border-4 border-slate-100 border-t-slate-900 dark:border-slate-800 dark:border-t-white" />
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white animate-pulse">Memuat Data...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center rounded-[2.5rem] sm:rounded-[3rem] border border-slate-200/60 bg-gradient-to-b from-white to-slate-50/30 py-20 sm:py-32 text-center shadow-xl shadow-slate-200/20 overflow-hidden dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50 dark:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-100/50 via-transparent to-transparent dark:from-slate-800/50" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 mb-8 shadow-2xl shadow-indigo-500/10 dark:from-indigo-900/40 dark:to-indigo-800/20 dark:text-indigo-400 ring-8 ring-indigo-50/50 dark:ring-indigo-900/20 transition-transform duration-500 hover:scale-110">
              <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
          </div>
          <h3 className="relative text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Data Kosong</h3>
          <p className="relative mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 max-w-sm mx-auto uppercase tracking-widest leading-relaxed">
              Belum ada infografis yang ditambahkan. Silakan klik tombol Tambah Infografis.
          </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {items.map((item) => (
        <article
          key={item.id}
          className="group relative flex flex-col sm:flex-row overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-300 border-slate-200/60 bg-white hover:bg-slate-50/50 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900"
        >
          {/* Image Preview - Portrait */}
          <div className="relative w-full sm:w-40 xl:w-48 aspect-[3/4] shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 border-b sm:border-b-0 sm:border-r border-slate-200/60 dark:border-slate-800 transition-all">
            <Image 
              src={item.image_url} 
              alt={item.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
              sizes="(max-width: 640px) 100vw, 12rem"
            />
            {/* Category Label Overlay */}
            <div className="absolute top-3 left-3 flex">
              <span className="inline-flex items-center rounded-lg bg-white/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm dark:bg-slate-900/90 dark:text-white">
                 {item.category === "utama" ? "Utama" : 
                  item.category === "kristen" ? "Kristen" : 
                  item.category === "katolik" ? "Katolik" : 
                  item.category === "islam" ? "Islam" : 
                  item.category === "hindu" ? "Hindu" : item.category || "Umum"}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
            {/* Content Info */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                 <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    Urutan #{toNumber(item.sort_order, 0)}
                 </span>
                 <StatusPill published={item.is_published} />
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors line-clamp-3">
                {item.title}
              </h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
                {item.caption || "Tidak ada deskripsi"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-row items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
               <ActionIconButton
                  title="Edit infografis"
                  onClick={() => onEdit(item)}
                  variant="neutral"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m4 20 4.1-.8L18 9.3 14.7 6 4.8 15.9 4 20Z" /><path d="m12.9 7.8 3.3 3.3" /></svg>
                </ActionIconButton>

                <ActionIconButton
                  title={deletingId === item.id ? "Menghapus..." : "Hapus infografis"}
                  onClick={() => onDelete(item.id)}
                  disabled={deletingId === item.id}
                  variant="danger"
                >
                  {deletingId === item.id ? (
                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 7h16M9 7V4.8a.8.8 0 0 1 .8-.8h4.4a.8.8 0 0 1 .8.8V7M7 7v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7M10 11v5M14 11v5" /></svg>
                  )}
                </ActionIconButton>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
