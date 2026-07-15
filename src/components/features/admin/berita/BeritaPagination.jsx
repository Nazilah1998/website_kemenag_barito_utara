import React from "react";
import { buildPagination } from "@/lib/berita-utils";

export function BeritaPagination({
  totalPages,
  safeCurrentPage,
  setCurrentPage
}) {
  const paginationItems = buildPagination(totalPages, safeCurrentPage);

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-5 border-t border-slate-200 pt-8 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={safeCurrentPage === 1}
          className="flex h-9 sm:h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 sm:px-4 text-xs font-semibold text-slate-600 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
        >
          Sebelumnya
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {paginationItems.map((item, index) =>
            item === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-sm font-medium text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => setCurrentPage(item)}
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-sm font-semibold transition-all border ${safeCurrentPage === item
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20 dark:bg-emerald-500 dark:border-emerald-500"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
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
          className="flex h-9 sm:h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 sm:px-4 text-xs font-semibold text-slate-600 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
        >
          Selanjutnya
        </button>
      </div>

      <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        Menampilkan halaman <span className="font-bold text-slate-900 dark:text-white">{safeCurrentPage}</span> dari <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
      </p>
    </div>
  );
}
