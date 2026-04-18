"use client";

import { useMemo } from "react";
import { useLaporanAdmin } from "@/hooks/useLaporanAdmin";
import LaporanCategoryPanel from "./laporan/LaporanCategoryPanel";
import LaporanUploadPanel from "./laporan/LaporanUploadPanel";
import LaporanDocumentPanel from "./laporan/LaporanDocumentPanel";

export default function AdminLaporanCategoryManager({
    category: initialCategory,
    categories = [],
}) {
    const firstCategory = useMemo(() => {
        if (initialCategory?.slug) return initialCategory;
        return categories?.[0] || null;
    }, [initialCategory, categories]);

    const admin = useLaporanAdmin({
        initialCategory: firstCategory,
        categories,
    });

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <LaporanCategoryPanel
                    categories={categories}
                    activeSlug={admin.activeSlug}
                    activeCategory={admin.activeCategory}
                    loadingSlug={admin.loadingSlug}
                    onSwitchCategory={admin.handleSwitchCategory}
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-12">
                <div className="xl:col-span-4">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                        <LaporanUploadPanel
                            activeCategory={admin.activeCategory}
                            docForm={admin.docForm}
                            selectedFile={admin.selectedFile}
                            savingDocument={admin.savingDocument}
                            uploadFeedback={admin.uploadFeedback}
                            setDocForm={admin.setDocForm}
                            setSelectedFile={admin.setSelectedFile}
                            handleUpload={admin.handleUpload}
                            resetForm={admin.resetForm}
                        />
                    </div>
                </div>

                <div className="xl:col-span-8">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
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
        </div>
    );
}