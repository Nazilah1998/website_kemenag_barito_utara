"use client";

import { Button, Feedback, Input, Textarea } from "./LaporanUi";
import { formatBytes, normalizeDocUrl } from "@/lib/laporan-admin";

export default function LaporanDocumentPanel({
    activeCategory,
    filteredDocuments,
    yearOptions,
    yearFilter,
    setYearFilter,
    loadingSlug,
    activeSlug,
    editingId,
    editForm,
    setEditForm,
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
    return (
        <section
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            aria-labelledby="laporan-dokumen-title"
            aria-busy={loadingSlug === activeSlug}
        >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 id="laporan-dokumen-title" className="text-base font-bold text-slate-900">
                        Daftar Dokumen
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Kategori:{" "}
                        <span className="font-semibold text-emerald-700">
                            {activeCategory?.title || "—"}
                        </span>
                        {" · "}
                        {filteredDocuments.length} dokumen
                    </p>
                </div>

                {yearOptions.length > 0 ? (
                    <label className="block w-full sm:w-48" htmlFor="laporan-year-filter">
                        <span className="mb-1 block text-xs font-semibold text-slate-600">
                            Filter tahun
                        </span>
                        <select
                            id="laporan-year-filter"
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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

            {loadingSlug === activeSlug ? (
                <div
                    className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"
                    role="status"
                    aria-live="polite"
                >
                    <p className="text-sm font-semibold text-slate-700">
                        Memuat dokumen…
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Mohon tunggu, daftar dokumen sedang diperbarui.
                    </p>
                </div>
            ) : filteredDocuments.length > 0 ? (
                <div className="mt-4 space-y-3">
                    {filteredDocuments.map((doc, index) => {
                        const previewUrl = normalizeDocUrl(doc);
                        const isEditing = editingId === doc.id;
                        const isPublishing = publishingId === doc.id;
                        const isSavingEdit = savingEditId === doc.id;
                        const isDeleting = deletingId === doc.id;
                        const isBusy = isPublishing || isSavingEdit || isDeleting;

                        return (
                            <article
                                key={doc.id}
                                className="rounded-2xl border border-slate-200 p-4"
                            >
                                {!isEditing ? (
                                    <div className="flex flex-wrap items-start gap-4">
                                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                                            {index + 1}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-slate-900">
                                                {doc.title}
                                            </p>

                                            {doc.description ? (
                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    {doc.description}
                                                </p>
                                            ) : (
                                                <p className="mt-1 text-sm italic text-slate-400">
                                                    Tidak ada deskripsi untuk dokumen ini.
                                                </p>
                                            )}

                                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                                                {doc.year ? (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1">
                                                        Tahun {doc.year}
                                                    </span>
                                                ) : null}

                                                <span className="rounded-full bg-slate-100 px-3 py-1">
                                                    {formatBytes(doc.file_size)}
                                                </span>

                                                {typeof doc.view_count === "number" ? (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1">
                                                        Dibaca {doc.view_count}x
                                                    </span>
                                                ) : null}

                                                <span
                                                    className={`rounded-full px-3 py-1 ${doc.is_published
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {doc.is_published ? "Published" : "Draft"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {previewUrl ? (
                                                <a
                                                    href={previewUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                                >
                                                    Preview
                                                </a>
                                            ) : null}

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
                                                onClick={() => onDelete(doc)}
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
                                                label="Judul Dokumen"
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
                                            value={editForm.description}
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                        />

                                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(editForm.is_published)}
                                                onChange={(e) =>
                                                    setEditForm((prev) => ({
                                                        ...prev,
                                                        is_published: e.target.checked,
                                                    }))
                                                }
                                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-slate-700">
                                                Dokumen dipublikasikan
                                            </span>
                                        </label>

                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => onSaveEdit(doc)}
                                                loading={isSavingEdit}
                                                loadingText="Menyimpan perubahan…"
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
            ) : (
                <div
                    className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"
                    role="status"
                    aria-live="polite"
                >
                    <p className="text-sm font-semibold text-slate-700">
                        Belum ada dokumen pada kategori ini
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Upload dokumen PDF pertama atau pilih kategori lain untuk melihat isi yang tersedia.
                    </p>
                </div>
            )}
        </section>
    );
}