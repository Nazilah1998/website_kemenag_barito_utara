"use client";

import React from "react";
import { useAuditManager } from "@/hooks/useAuditManager";
import {
  AuditTable,
  AuditPagination,
  AuditStats,
  DeleteConfirmModal,
  FloatingFeedback
} from "./audit/AuditUI";

export default function AdminAuditManager() {
  const a = useAuditManager();

  return (
    <section className="space-y-12">
      <FloatingFeedback
        message={a.message}
        error={a.error}
        onClose={() => {
          a.setMessage("");
          a.setError("");
        }}
      />

      {/* Header Section */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Audit Log
          </h1>
          <p className="mt-3 text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            Pantau dan kelola riwayat aktivitas administratif secara real-time.
            Bersihkan log secara berkala untuk menjaga performa database tetap optimal.
          </p>
        </div>

        <button
          type="button"
          onClick={a.requestClearAll}
          disabled={a.items.length === 0 || a.loading}
          className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-rose-600 px-7 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-rose-600/20 transition-all hover:bg-rose-700 hover:shadow-rose-600/30 active:scale-95 disabled:opacity-30 disabled:grayscale"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Bersihkan Semua Log</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Content Card */}
          <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-6 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Aktivitas Terbaru
                  </p>
                </div>
              </div>

              <AuditTable
                items={a.paginatedItems}
                loading={a.loading}
                onDelete={a.requestDelete}
                deletingId={a.deletingId}
              />

              <AuditPagination
                currentPage={a.currentPage}
                totalPages={a.totalPages}
                onPageChange={a.handlePageChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <AuditStats totalCount={a.items.length} />

          <div className="rounded-[2rem] border border-slate-100 bg-slate-50/30 p-8 dark:border-slate-800 dark:bg-slate-900/30">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Informasi Audit</h4>
            <ul className="mt-6 space-y-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <li className="flex gap-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                <span>Log mencatat aksi pembuatan, pembaruan, dan penghapusan data.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                <span>Penghapusan log bersifat permanen dan tidak dapat dipulihkan.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                <span>Direkomendasikan untuk membersihkan log setiap 30 hari sekali.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        open={a.showDeleteModal}
        onConfirm={a.confirmDelete}
        onCancel={a.cancelDelete}
        loading={Boolean(a.deletingId) || a.clearingAll}
        title={a.bulkAction ? "Bersihkan Seluruh Log?" : "Hapus Riwayat Aktivitas?"}
        description={
          a.bulkAction
            ? "Tindakan ini akan menghapus SELURUH riwayat aktivitas admin secara permanen. Pastikan Anda tidak lagi membutuhkan data ini untuk audit."
            : "Satu entri riwayat aktivitas ini akan dihapus secara permanen dari database."
        }
      />
    </section>
  );
}
