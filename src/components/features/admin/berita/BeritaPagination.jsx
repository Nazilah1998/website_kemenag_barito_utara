import React from "react";
import { buildPagination } from "@/lib/berita-utils";

export function BeritaPagination({
  totalPages,
  safeCurrentPage,
  setCurrentPage
}) {
  const paginationItems = buildPagination(totalPages, safeCurrentPage);

  return (
    <div className="mt-8 flex flex-col gap-6 border-t-2 border-slate-100 pt-8 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
        Halaman <span className="text-slate-900 dark:text-white">{safeCurrentPage}</span> dari <span className="text-slate-900 dark:text-white">{totalPages}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={safeCurrentPage === 1}
          className="flex h-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:bg-transparent dark:hover:border-white dark:hover:text-white"
        >
          Prev
        </button>

        <div className="flex items-center gap-1.5">
          {paginationItems.map((item, index) =>
            item === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-xs font-black text-slate-300">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => setCurrentPage(item)}
                className={`h-10 min-w-[40px] rounded-xl text-[10px] font-black transition-all border-2 ${safeCurrentPage === item
                  ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-black shadow-lg shadow-slate-900/20"
                  : "border-slate-100 bg-white text-slate-400 hover:border-slate-900 hover:text-slate-900 dark:border-slate-800 dark:bg-transparent dark:hover:border-white dark:hover:text-white"
                  }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={safeCurrentPage === totalPages}
          className="flex h-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-800 dark:bg-transparent dark:hover:border-white dark:hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
