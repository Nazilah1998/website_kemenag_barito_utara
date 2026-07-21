// src/components/features/admin/AdminLaporanCategoryManager.jsx
"use client";

import React, { useMemo } from "react";
import { useLaporanAdmin } from "@/hooks/useLaporanAdmin";
import LaporanCategoryPanel from "./laporan/LaporanCategoryPanel";
import LaporanUploadPanel from "./laporan/LaporanUploadPanel";
import LaporanDocumentPanel from "./laporan/LaporanDocumentPanel";
import { DeleteConfirmModal, FloatingFeedback } from "./laporan/LaporanUi";

export default function AdminLaporanCategoryManager({
    category: initialCategory,
    categories = [],
}) {
    const mergedCategories = useMemo(() => {
        if (!initialCategory?.slug) return categories;
        const index = categories.findIndex((c) => c.slug === initialCategory.slug);
        if (index !== -1) {
            const copy = [...categories];
            copy[index] = { ...categories[index], ...initialCategory };
            return copy;
        }
        return [initialCategory, ...categories];
    }, [initialCategory, categories]);

    const firstCategory = useMemo(() => {
        if (initialCategory?.slug) return initialCategory;
        return mergedCategories?.[0] || null;
    }, [initialCategory, mergedCategories]);

    const admin = useLaporanAdmin({
        initialCategory: firstCategory,
        categories: mergedCategories,
    });

    return (
        <div className="space-y-6 sm:space-y-12 animate-in fade-in duration-700 delay-100">
            <FloatingFeedback
                message={admin.actionFeedback?.message || admin.uploadFeedback?.message}
                error={admin.actionFeedback?.type === "error" || admin.uploadFeedback?.type === "error" ? (admin.actionFeedback?.message || admin.uploadFeedback?.message) : ""}
                onClose={() => {
                    // Feedback otomatis hilang, tapi bisa di-close manual
                }}
            />

            {/* Category Selection Area */}
            <div className="rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 bg-white p-4 sm:p-12 shadow-2xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                <LaporanCategoryPanel
                    categories={categories}
                    activeSlug={admin.activeSlug}
                    activeCategory={admin.activeCategory}
                    loadingSlug={admin.loadingSlug}
                    onSwitchCategory={admin.handleSwitchCategory}
                />
            </div>

            {/* Content Area: Form & List */}
            <div className="grid gap-6 sm:gap-8 xl:grid-cols-12">
                {/* Left Side: Upload Form */}
                <div className="xl:col-span-5 flex flex-col h-full">
                    <div className="flex-1 rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 bg-white p-4 sm:p-10 shadow-2xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                        <LaporanUploadPanel
                            activeCategory={admin.activeCategory}
                            docForm={admin.docForm}
                            selectedFiles={admin.selectedFiles}
                            savingDocument={admin.savingDocument}
                            uploadFeedback={admin.uploadFeedback}
                            setDocForm={admin.setDocForm}
                            setSelectedFiles={admin.setSelectedFiles}
                            handleUpload={admin.handleUpload}
                            resetForm={admin.resetForm}
                        />
                    </div>
                </div>

                {/* Right Side: Document List */}
                <div className="xl:col-span-7 flex flex-col h-full">
                    <div className="flex-1 rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100 bg-white p-4 sm:p-10 shadow-2xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                        <LaporanDocumentPanel
                            activeCategory={admin.activeCategory}
                            activeSlug={admin.activeSlug}
                            loadingSlug={admin.loadingSlug}
                            paginatedDocuments={admin.paginatedDocuments}
                            filteredDocuments={admin.filteredDocuments}
                            yearOptions={admin.yearOptions}
                            yearFilter={admin.yearFilter}
                            setYearFilter={admin.setYearFilter}
                            currentPage={admin.currentPage}
                            totalPages={admin.totalPages}
                            setCurrentPage={admin.setCurrentPage}
                            editingId={admin.editingId}
                            editForm={admin.editForm}
                            editFile={admin.editFile}
                            setEditForm={admin.setEditForm}
                            setEditFile={admin.setEditFile}
                            actionFeedback={admin.actionFeedback}
                            publishingId={admin.publishingId}
                            savingEditId={admin.savingEditId}
                            deletingId={admin.deletingId}
                            onStartEdit={admin.startEdit}
                            onTogglePublish={admin.togglePublish}
                            onDelete={admin.deleteDocument}
                            onSaveEdit={admin.saveEdit}
                            onCancelEdit={admin.cancelEdit}
                        />
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                open={admin.showDeleteModal}
                onConfirm={admin.handleConfirmDelete}
                onCancel={admin.handleCancelDelete}
                loading={Boolean(admin.deletingId)}
                title="Hapus Dokumen?"
                description="Dokumen ini akan dihapus permanen dari sistem. Anda harus mengunggah ulang jika ingin menampilkannya kembali."
            />
        </div>
    );
}
