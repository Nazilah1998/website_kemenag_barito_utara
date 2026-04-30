"use client";

import React from "react";
import { useBeritaManager } from "@/hooks/useBeritaManager";
import { FloatingFeedback } from "./berita/BeritaUI";
import { BeritaStats } from "./berita/BeritaStats";
import { BeritaFilters } from "./berita/BeritaFilters";
import { BeritaTable } from "./berita/BeritaTable";
import { BeritaPagination } from "./berita/BeritaPagination";
import { BeritaFormModal } from "./berita/BeritaFormModal";
import { BeritaGalleryModal } from "./berita/BeritaGalleryModal";
import { DeleteConfirmModal, CloseFormConfirmModal } from "./berita/BeritaModals";

export default function AdminBeritaManager() {
  const m = useBeritaManager();

  return (
    <>
      <DeleteConfirmModal
        open={Boolean(m.deleteTarget)}
        item={m.deleteTarget}
        deleting={Boolean(m.deletingId)}
        onClose={m.onCloseDeleteModal}
        onConfirm={m.onDeleteConfirmed}
      />

      <CloseFormConfirmModal
        open={m.closeConfirmOpen}
        onCancel={m.handleCancelCloseConfirm}
        onConfirm={m.handleConfirmCloseForm}
      />

      <FloatingFeedback
        message={m.message}
        error={m.error}
        onClose={() => { m.setMessage(""); m.setError(""); }}
      />

      <section className="space-y-8">
        <BeritaStats stats={m.stats} />

        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
          <BeritaFilters
            query={m.query} setQuery={m.setQuery}
            statusFilter={m.statusFilter} setStatusFilter={m.setStatusFilter}
            yearFilter={m.yearFilter} setYearFilter={m.setYearFilter}
            monthFilter={m.monthFilter} setMonthFilter={m.setMonthFilter}
            yearOptions={m.yearOptions} monthOptions={m.monthOptions}
            onAddClick={m.handleOpenCreate}
            filteredCount={m.filteredItems.length} totalCount={m.items.length}
          />

          <BeritaTable
            items={m.paginatedItems} loading={m.loading}
            startIndex={m.startIndex} onEdit={m.handleOpenEdit}
            onDelete={m.handleAskDelete} onGallery={m.handleOpenGalleryForm}
            deletingId={m.deletingId}
          />

          <BeritaPagination
            totalPages={m.totalPages}
            safeCurrentPage={m.safeCurrentPage}
            setCurrentPage={m.setCurrentPage}
          />
        </div>
      </section>

      <BeritaFormModal
        open={m.openForm} editingId={m.editingId} form={m.form}
        dirty={m.dirty} saving={m.saving} uploadingCover={m.uploadingCover}
        wordCount={m.wordCount} readingTime={m.readingTime} previewSlug={m.previewSlug}
        coverPreviewSrc={m.coverPreviewSrc} editorRef={m.editorRef}
        onClose={m.handleCloseForm} onChange={m.handleChange}
        onPublishedToggle={m.handlePublishedToggle} onEditorInput={m.onEditorInput}
        onEditorPaste={m.onEditorPaste} onRunCommand={m.onRunCommand}
        onInsertLink={m.onInsertLink} onCoverChange={m.onCoverChange}
        onClearCover={m.onClearCover} onSave={m.onSave}
      />

      <BeritaGalleryModal
        open={m.openGalleryForm} form={m.galleryForm}
        previewSrc={m.galleryPreviewSrc} sendingId={m.gallerySendingId}
        uploading={m.uploadingGalleryImage} prefillLoading={m.galleryPrefillLoading}
        isAlreadyInGallery={m.isAlreadyInGallery}
        onClose={m.handleCloseGalleryForm} onChange={m.handleGalleryChange}
        onFileChange={m.onGalleryFileChange} onClearImage={m.onClearGalleryImage}
        onSubmit={m.onSubmitGallery} onDelete={m.onDeleteGallery}
      />
    </>
  );
}