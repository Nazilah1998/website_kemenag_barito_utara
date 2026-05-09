"use client";

import React from "react";
import { useGaleriManager } from "@/hooks/useGaleriManager";
import { GaleriTable } from "./galeri/GaleriTable";
import { GaleriFormModal } from "./galeri/GaleriFormModal";
import { FloatingFeedback, GaleriPagination, DeleteConfirmModal } from "./galeri/GaleriUI";

export default function AdminGaleriManager() {
  const g = useGaleriManager();

  return (
    <section className="space-y-12">
      <FloatingFeedback
        message={g.message}
        error={g.error}
        onClose={() => {
          g.setMessage("");
          g.setError("");
        }}
      />

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Galeri Visual
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Koleksi dokumentasi visual instansi yang ditampilkan secara publik.
          </p>
        </div>

        <button
          type="button"
          onClick={g.handleOpenCreate}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 active:scale-95 dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-slate-200"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Visual</span>
        </button>
      </div>

      {/* Content Card */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-8 shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Total {g.items.length} visual dokumentasi
            </p>
          </div>
        </div>

        <GaleriTable
          items={g.paginatedItems}
          loading={g.loading}
          onEdit={g.handleOpenEdit}
          onDelete={g.handleDelete}
          deletingId={g.deletingId}
        />

        <GaleriPagination
          currentPage={g.currentPage}
          totalPages={g.totalPages}
          onPageChange={g.setCurrentPage}
        />
      </div>

      <GaleriFormModal
        open={g.openForm}
        editingId={g.editingId}
        form={g.form}
        imagePreview={g.imagePreview}
        saving={g.saving}
        uploadingImage={g.uploadingImage}
        onClose={g.handleCloseForm}
        onChange={g.handleChange}
        onFileChange={g.handleImageFileChange}
        onSave={g.handleSave}
      />

      <DeleteConfirmModal
        open={g.showDeleteConfirm}
        onConfirm={g.handleConfirmDelete}
        onCancel={g.handleCancelDelete}
        loading={Boolean(g.deletingId)}
        title="Hapus Visual Galeri?"
        description="Data ini akan dihapus permanen. Pastikan Anda memiliki cadangan jika ingin menampilkannya kembali."
      />
    </section>
  );
}
