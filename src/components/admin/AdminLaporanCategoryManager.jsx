"use client";

import { useLaporanAdmin } from "@/hooks/useLaporanAdmin";
import LaporanCategoryPanel from "./laporan/LaporanCategoryPanel";
import LaporanUploadPanel from "./laporan/LaporanUploadPanel";
import LaporanDocumentPanel from "./laporan/LaporanDocumentPanel";

export default function AdminLaporanCategoryManager({
    category: initialCategory,
    categories = [],
}) {
    console.log("[AdminLaporanCategoryManager] categories prop:", categories);
    console.log("[AdminLaporanCategoryManager] initialCategory prop:", initialCategory);

    const admin = useLaporanAdmin({
        initialCategory,
        categories,
    });

    return (
        <div className="space-y-6">
            <LaporanCategoryPanel
                categories={categories}
                activeSlug={admin.activeSlug}
                activeCategory={admin.activeCategory}
                loadingSlug={admin.loadingSlug}
                onSwitchCategory={admin.handleSwitchCategory}
            />

            <LaporanUploadPanel
                activeCategory={admin.activeCategory}
                docForm={admin.docForm}
                setDocForm={admin.setDocForm}
                setSelectedFile={admin.setSelectedFile}
                savingDocument={admin.savingDocument}
                uploadFeedback={admin.uploadFeedback}
                onSubmit={admin.handleUpload}
                onReset={admin.resetForm}
            />

            <LaporanDocumentPanel
                activeCategory={admin.activeCategory}
                filteredDocuments={admin.filteredDocuments}
                yearOptions={admin.yearOptions}
                yearFilter={admin.yearFilter}
                setYearFilter={admin.setYearFilter}
                loadingSlug={admin.loadingSlug}
                activeSlug={admin.activeSlug}
                editingId={admin.editingId}
                editForm={admin.editForm}
                setEditForm={admin.setEditForm}
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
    );
}