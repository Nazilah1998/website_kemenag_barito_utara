"use client";

import { Button, Feedback, Input, Textarea } from "./LaporanUi";
import { formatBytes } from "@/lib/laporan-admin";

export default function LaporanDocumentPanel({
    activeCategory,
    paginatedDocuments = [],
    filteredDocuments = [],
    yearOptions = [],
    yearFilter,
    setYearFilter,
    currentPage,
    totalPages,
    setCurrentPage,
    loadingSlug,
    activeSlug,
    editingId,
    editForm,
    editFile,
    setEditForm,
    setEditFile,
    actionFeedback,
    publishingId,
    savingEditId,
    deletingId,
    onStartEdit,
    onTogglePublish,
    onDelete,
    onSaveEdit,
    onCancelEdit,
}) {
    const isLoading = Boolean(activeSlug && loadingSlug === activeSlug);

    return (
        <section
            aria-labelledby="laporan-dokumen-title"
            aria-busy={isLoading}
            className="min-h-105"
        >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2
                        id="laporan-dokumen-title"
                        className="text-base font-bold text-slate-900 dark:text-slate-100"
                    >
                        Daftar Dokumen
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Kategori{" "}
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {activeCategory?.title || "—"}
                        </span>
                        {" · "}
                        {filteredDocuments.length} dokumen
                    </p>
                </div>

                {yearOptions.length > 0 ? (
                    <label className="block w-full sm:w-48" htmlFor="laporan-year-filter">
                        <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Filter tahun
                        </span>
                        <select
                            id="laporan-year-filter"
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-emerald-900/40"
                        >
                            <option value="">Semua tahun</option>
                            {yearOptions.map((year) => (
                                <option key={year} value={String(year)}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>
                ) : null}
            </div>

            <Feedback {...actionFeedback} />

            {isLoading ? (
                <div
                    className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/40"
                    role="status"
                    aria-live="polite"
                >
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Memuat dokumen…
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Mohon tunggu, daftar dokumen sedang diperbarui.
                    </p>
                </div>
            ) : paginatedDocuments.length > 0 ? (
                <>
                    <div className="mt-4 space-y-3">
                        {paginatedDocuments.map((doc, index) => {
                            const isEditing = editingId === doc.id;
                            const isPublishing = publishingId === doc.id;
                            const isSavingEdit = savingEditId === doc.id;
                            const isDeleting = deletingId === doc.id;
                            const isBusy = isPublishing || isSavingEdit || isDeleting;

                            return (
                                <article
                                    key={doc.id}
                                    className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                                >
                                    {!isEditing ? (
                                        <div className="flex flex-wrap items-start gap-4">
                                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                {(currentPage - 1) * 4 + index + 1}
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    {doc.title}
                                                </p>

                                                {doc.description ? (
                                                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                        {doc.description}
                                                    </p>
                                                ) : (
                                                    <p className="mt-1 text-sm italic text-slate-400 dark:text-slate-500">
                                                        Tidak ada deskripsi untuk dokumen ini.
                                                    </p>
                                                )}

                                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {doc.year ? (
                                                        <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                                                            Tahun {doc.year}
                                                        </span>
                                                    ) : null}

                                                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                                                        {formatBytes(doc.file_size)}
                                                    </span>

                                                    {typeof doc.view_count === "number" ? (
                                                        <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                                                            Dilihat {doc.view_count}x
                                                        </span>
                                                    ) : null}

                                                    <span
                                                        className={`rounded-full px-3 py-1 ${doc.is_published
                                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                                                            }`}
                                                    >
                                                        {doc.is_published ? "Published" : "Draft"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <a
                                                    href={`/api/laporan/view/${doc.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
                                                >
                                                    Preview
                                                </a>

                                                <Button
                                                    type="button"
                                                    tone="ghost"
                                                    onClick={() => onStartEdit(doc)}
                                                    disabled={isBusy}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    tone="ghost"
                                                    onClick={() => onTogglePublish(doc)}
                                                    loading={isPublishing}
                                                    loadingText="Memproses status…"
                                                >
                                                    {doc.is_published ? "Unpublish" : "Publish"}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    tone="danger"
                                                    onClick={() => onDelete(doc.id)}
                                                    loading={isDeleting}
                                                    loadingText="Menghapus dokumen…"
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <Input
                                                    inputId={`edit-title-${doc.id}`}
                                                    label="Judul dokumen"
                                                    value={editForm.title}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            title: e.target.value,
                                                        }))
                                                    }
                                                />

                                                <Input
                                                    inputId={`edit-year-${doc.id}`}
                                                    label="Tahun"
                                                    type="number"
                                                    min="2000"
                                                    max="2100"
                                                    value={editForm.year}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            year: e.target.value,
                                                        }))
                                                    }
                                                />
                                            </div>

                                            <Textarea
                                                inputId={`edit-description-${doc.id}`}
                                                label="Deskripsi"
                                                rows={3}
                                                value={editForm.description}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({
                                                        ...prev,
                                                        description: e.target.value,
                                                    }))
                                                }
                                            />

                                            <div>
                                                <label
                                                    htmlFor={`pdf-edit-input-${doc.id}`}
                                                    className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                                                >
                                                    Ganti file PDF
                                                </label>

                                                <input
                                                    id={`pdf-edit-input-${doc.id}`}
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                                />

                                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                    Kosongkan jika tidak ingin mengganti file PDF.
                                                </p>

                                                {editFile ? (
                                                    <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                        File baru: {editFile.name}
                                                    </p>
                                                ) : null}
                                            </div>

                                            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(editForm.is_published)}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            is_published: e.target.checked,
                                                        }))
                                                    }
                                                />
                                                Publikasikan dokumen
                                            </label>

                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={() => onSaveEdit(doc.id)}
                                                    loading={isSavingEdit}
                                                    loadingText="Menyimpan…"
                                                >
                                                    Simpan Perubahan
                                                </Button>

                                                <Button
                                                    type="button"
                                                    tone="ghost"
                                                    onClick={onCancelEdit}
                                                    disabled={isSavingEdit}
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>

                    {totalPages > 1 ? (
                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Halaman {currentPage} dari {totalPages}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    tone="ghost"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage <= 1}
                                >
                                    Sebelumnya
                                </Button>

                                {Array.from({ length: totalPages }).map((_, index) => {
                                    const page = index + 1;
                                    const isActive = page === currentPage;

                                    return (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${isActive
                                                ? "bg-emerald-700 text-white dark:bg-emerald-600"
                                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <Button
                                    type="button"
                                    tone="ghost"
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage >= totalPages}
                                >
                                    Berikutnya
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </>
            ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Belum ada dokumen pada kategori ini.
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Upload file PDF dari panel sebelah kiri untuk menambah dokumen laporan.
                    </p>
                </div>
            )}
        </section>
    );
}