// src/components/admin/laporan/LaporanDocumentPanel.jsx
"use client";

import React from "react";
import { Button, Feedback, Input, Textarea, Badge } from "./LaporanUi";
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
            className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-700 delay-150"
        >
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-slate-900 pb-6 dark:border-white">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1.5">Data Terverifikasi</p>
                    <h2
                        id="laporan-dokumen-title"
                        className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase"
                    >
                        Arsip Dokumen
                    </h2>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {filteredDocuments.length} Dokumen ditemukan
                    </p>
                </div>

                {yearOptions.length > 0 && (
                    <div className="w-full lg:w-48">
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100 ml-1 mb-2 block">
                            Periode
                        </label>
                        <div className="relative group">
                            <select
                                id="laporan-year-filter"
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="w-full h-11 appearance-none rounded-xl border-2 bg-slate-50/50 px-4 text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none transition-all border-slate-100 focus:border-slate-900 focus:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-white dark:focus:bg-slate-800"
                            >
                                <option value="" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Semua Tahun</option>
                                {yearOptions.map((year) => (
                                    <option key={year} value={String(year)} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                                        Th. {year}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="4">
                                    <path d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <Feedback {...actionFeedback} />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-12 w-12 animate-spin rounded-2xl border-4 border-slate-100 border-t-slate-900 dark:border-slate-800 dark:border-t-white" />
                    <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white animate-pulse">Memuat Data...</p>
                </div>
            ) : paginatedDocuments.length > 0 ? (
                <div className="flex-1 space-y-4">
                    {paginatedDocuments.map((doc, index) => {
                        const isEditing = editingId === doc.id;
                        const isPublishing = publishingId === doc.id;
                        const isSavingEdit = savingEditId === doc.id;
                        const isDeleting = deletingId === doc.id;
                        const isBusy = isPublishing || isSavingEdit || isDeleting;

                        return (
                            <article
                                key={doc.id}
                                className={`group relative overflow-hidden rounded-[2rem] border-2 transition-all duration-500 ${isEditing
                                    ? "border-slate-900 bg-slate-900 shadow-xl dark:border-white dark:bg-white scale-[1.01] z-20"
                                    : "border-slate-100 bg-white hover:border-slate-900 dark:border-slate-800 dark:bg-slate-800/20 dark:hover:border-white"
                                    }`}
                            >
                                {!isEditing ? (
                                    <div className="flex flex-col xl:flex-row xl:items-center gap-6 p-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg group-hover:scale-105 transition-transform dark:bg-white dark:text-black">
                                            <span className="text-xs font-black">
                                                {(currentPage - 1) * 3 + index + 1}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <Badge tone={doc.is_published ? "success" : "warn"}>
                                                    {doc.is_published ? "Publik" : "Draft"}
                                                </Badge>
                                                {doc.year && <Badge>{doc.year}</Badge>}
                                                <Badge>{formatBytes(doc.file_size)}</Badge>
                                            </div>

                                            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {doc.title}
                                            </h3>

                                            <p className="mt-2 text-[13px] font-bold leading-snug text-slate-500 dark:text-slate-400 line-clamp-1">
                                                {doc.description || "— No additional description provided."}
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-slate-50 pt-4 dark:border-white/5">
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="4"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    {doc.view_count || 0} HITS
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {new Date(doc.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 xl:flex-nowrap">
                                            <a
                                                href={`/api/laporan/view/${doc.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex h-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-4 text-[9px] font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-900 hover:text-white dark:border-white dark:bg-transparent dark:text-white dark:hover:bg-white dark:hover:text-black"
                                            >
                                                Preview
                                            </a>

                                            <Button
                                                type="button"
                                                tone="soft"
                                                size="sm"
                                                onClick={() => onStartEdit(doc)}
                                                disabled={isBusy}
                                                icon={<svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                type="button"
                                                tone="ghost"
                                                size="sm"
                                                onClick={() => onTogglePublish(doc)}
                                                loading={isPublishing}
                                            >
                                                {doc.is_published ? "Unpublish" : "Publish"}
                                            </Button>

                                            <Button
                                                type="button"
                                                tone="danger"
                                                size="sm"
                                                onClick={() => onDelete(doc.id)}
                                                loading={isDeleting}
                                                icon={<svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="4"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 animate-in fade-in duration-500">
                                        <div className="flex items-center justify-between mb-8 border-b border-white/10 dark:border-black/10 pb-6">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 dark:text-black/50">Sistem Pembaruan</p>
                                                <h3 className="text-xl font-black text-white dark:text-black tracking-tighter uppercase">Edit Dokumen</h3>
                                            </div>
                                            <button onClick={onCancelEdit} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white hover:text-black dark:bg-black/10 dark:text-black dark:hover:bg-black dark:hover:text-white transition-all">
                                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="4"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <Input
                                                    inputId={`edit-title-${doc.id}`}
                                                    label="Judul Dokumen"
                                                    className="!h-12 !bg-white/5 !border-white/20 !text-white placeholder:text-white/30 dark:!bg-black/5 dark:!border-black/20 dark:!text-black"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                                                />

                                                <Input
                                                    inputId={`edit-year-${doc.id}`}
                                                    label="Tahun"
                                                    type="number"
                                                    className="!h-12 !bg-white/5 !border-white/20 !text-white dark:!bg-black/5 dark:!border-black/20 dark:!text-black"
                                                    value={editForm.year}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, year: e.target.value }))}
                                                />
                                            </div>

                                            <Textarea
                                                inputId={`edit-description-${doc.id}`}
                                                label="Keterangan"
                                                className="!min-h-[100px] !bg-white/5 !border-white/20 !text-white placeholder:text-white/30 dark:!bg-black/5 dark:!border-black/20 dark:!text-black"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                                            />

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 dark:text-black/50 ml-1">Update File</label>
                                                <div className="relative group">
                                                    <input
                                                        id={`pdf-edit-input-${doc.id}`}
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="flex h-12 w-full items-center justify-between rounded-xl border-2 border-dashed border-white/20 bg-white/5 px-5 dark:border-black/20 dark:bg-black/5">
                                                        <span className="text-[11px] font-bold text-white/60 dark:text-black/60 truncate pr-4 uppercase tracking-widest">
                                                            {editFile ? editFile.name : "Ganti File PDF..."}
                                                        </span>
                                                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/40 dark:text-black/40" fill="none" stroke="currentColor" strokeWidth="3">
                                                            <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <label className="flex cursor-pointer items-center gap-4 group/check bg-white/5 p-4 rounded-xl border-2 border-white/10 dark:bg-black/5 dark:border-black/10">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(editForm.is_published)}
                                                        onChange={(e) => setEditForm((p) => ({ ...p, is_published: e.target.checked }))}
                                                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-white/20 bg-white/10 transition-all checked:bg-white dark:border-black/20 dark:bg-black/10 dark:checked:bg-black"
                                                    />
                                                    <svg className="pointer-events-none absolute h-6 w-6 p-1 text-slate-900 opacity-0 transition-opacity peer-checked:opacity-100 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5">
                                                        <path d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-white dark:text-black block">Status Publikasi</span>
                                                </div>
                                            </label>

                                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-white/10 dark:border-black/10">
                                                <Button
                                                    type="button"
                                                    onClick={() => onSaveEdit(doc.id)}
                                                    loading={isSavingEdit}
                                                    className="w-full sm:flex-1 !bg-white !text-black hover:!bg-slate-100 dark:!bg-black dark:!text-white dark:hover:!bg-slate-900 shadow-none h-12"
                                                >
                                                    Simpan
                                                </Button>
                                                <Button
                                                    type="button"
                                                    tone="ghost"
                                                    onClick={onCancelEdit}
                                                    disabled={isSavingEdit}
                                                    className="w-full sm:w-auto !bg-transparent !border-white/20 !text-white/70 hover:!text-white hover:!bg-white/10 dark:!border-black/20 dark:!text-black/60 dark:hover:!text-black dark:hover:!bg-black/10 h-12"
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}

                    {totalPages > 1 && (
                        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t-2 border-slate-900 pt-8 dark:border-white lg:flex-row">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                <span className="text-slate-900 dark:text-white">{currentPage}</span> / <span className="text-slate-900 dark:text-white">{totalPages}</span>
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    tone="ghost"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage <= 1}
                                    icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4"><path d="M15 19l-7-7 7-7" /></svg>}
                                >
                                    Prev
                                </Button>

                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const p = i + 1;
                                        const isAct = p === currentPage;
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p)}
                                                className={`h-9 min-w-[36px] rounded-xl text-[10px] font-black transition-all border-2 ${isAct
                                                    ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-black"
                                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-800 dark:text-slate-500"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>

                                <Button
                                    type="button"
                                    tone="ghost"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="flex-row-reverse"
                                    icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4"><path d="M9 5l7 7-7 7" /></svg>}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

            ) : (
                <div className="flex flex-col items-center justify-center rounded-[3rem] border-4 border-dashed border-slate-100 bg-slate-50/20 py-32 text-center dark:border-slate-800 dark:bg-slate-900/10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-900 text-white dark:bg-white dark:text-black mb-8 shadow-2xl">
                        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Belum Ada Data</h3>
                    <p className="mt-3 text-sm font-bold text-slate-400 max-w-xs mx-auto uppercase tracking-widest leading-relaxed">
                        Database kosong. Silahkan tambahkan dokumen baru melalui panel navigasi sebelah kiri.
                    </p>
                </div>
            )}
        </section>
    );
}
