"use client";

import React from "react";
import { useSlidesManager } from "@/hooks/useSlidesManager";
import { SlideTable } from "./slides/SlideTable";
import { SlideFormModal } from "./slides/SlideFormModal";
import { FloatingFeedback, SlidePagination, DeleteConfirmModal } from "./slides/SlidesUI";

export default function AdminHomepageSlidesManager() {
  const s = useSlidesManager();

  return (
    <section className="space-y-12">
      <FloatingFeedback
        message={s.message}
        error={s.error}
        onClose={() => {
          s.setMessage && s.setMessage("");
          s.setError && s.setError("");
        }}
      />

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Slider Beranda
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Manajemen visual utama halaman depan website.
          </p>
        </div>

        <button
          type="button"
          onClick={s.handleOpenCreate}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 active:scale-95 dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-slate-200"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Slide</span>
        </button>
      </div>

      {/* Content Card */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-8 shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Total {s.items.length} slide • {s.totalPublished} aktif saat ini
            </p>
          </div>
        </div>

        <SlideTable
          items={s.paginatedItems}
          loading={s.loading}
          onEdit={s.handleOpenEdit}
          onDelete={s.handleDelete}
          deletingId={s.deletingId}
          toNumber={s.toNumber}
        />

        <SlidePagination
          currentPage={s.currentPage}
          totalPages={s.totalPages}
          onPageChange={s.handlePageChange}
        />
      </div>

      <SlideFormModal
        open={s.openForm}
        editingId={s.editingId}
        form={s.form}
        imagePreview={s.imagePreview}
        saving={s.saving}
        uploadingImage={s.uploadingImage}
        onClose={s.handleCloseForm}
        onChange={s.handleChange}
        onFileChange={s.handleImageFileChange}
        onSave={s.handleSave}
      />

      <DeleteConfirmModal
        open={s.showDeleteConfirm}
        onConfirm={s.handleConfirmDelete}
        onCancel={s.handleCancelDelete}
        loading={Boolean(s.deletingId)}
        title="Hapus Slide?"
        description="Slide ini akan dihapus permanen dari sistem. Anda harus mengunggah ulang jika ingin menampilkannya kembali."
      />
    </section>
  );
}
