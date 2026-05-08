"use client";

import React from "react";
import { usePublicDocumentBrowser } from "@/hooks/usePublicDocumentBrowser";
import { DocumentCard } from "./DocumentBrowserUI";
import { DocumentBrowserPagination } from "./DocumentBrowserPagination";

export default function PublicDocumentBrowser({ documents = [] }) {
  const d = usePublicDocumentBrowser(documents);
  const globalOffset = (d.page - 1) * d.docsPerPage;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Daftar Dokumen</h2>

        <label className="block w-full sm:w-52">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Filter Tahun</span>
          <select
            value={d.year} onChange={(e) => d.handleYearChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Semua Tahun</option>
            {d.yearOptions.map((y) => <option key={y} value={String(y)}>{y}</option>)}
          </select>
        </label>
      </div>

      {d.pagedDocuments.length > 0 ? (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {d.pagedDocuments.map((doc, idx) => (
              <li key={doc.id || idx}>
                <DocumentCard
                  doc={doc} index={globalOffset + idx + 1}
                  viewCount={d.viewCounts[doc.id] ?? Number(doc.view_count || 0)}
                  onView={d.handleViewDoc}
                />
              </li>
            ))}
          </ul>

          <DocumentBrowserPagination
            current={d.page} total={d.totalPages}
            onPageChange={d.setPage}
          />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">Belum ada dokumen untuk filter yang dipilih.</p>
        </div>
      )}
    </div>
  );
}