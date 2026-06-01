// src/components/admin/laporan/LaporanDocumentPanel.jsx
"use client";

import React from "react";
import { Button, Feedback, Input, Textarea, Badge } from "./LaporanUi";
import { formatBytes } from "@/lib/laporan-admin";

const BIDANG_LIST = [
    "Layanan Sub Bagian Tata Usaha",
    "Layanan Pendidikan Madrasah",
    "Layanan Pendidikan Agama Islam",
    "Layanan Pendidikan Diniyah dan Pontren",
    "Layanan Bimbingan Masyarakat Islam",
    "Layanan Bimbingan Masyarakat Kristen & Katolik",
    "Layanan Penyelenggara Zakat dan Wakaf",
    "Layanan Penyelenggara Hindu"
];

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
    const [isDraggingEdit, setIsDraggingEdit] = React.useState(false);
    const [isEditDropdownOpen, setIsEditDropdownOpen] = React.useState(false);

    const handleDragOverEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingEdit(true);
    };

    const handleDragLeaveEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingEdit(false);
    };

    const handleDropEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingEdit(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
                setEditFile(file);
            } else {
                alert("Hanya file PDF yang diizinkan.");
            }
        }
    };

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
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-slate-900 text-white shadow-md group-hover:scale-105 transition-transform dark:bg-white dark:text-black">
                                            <span className="text-[11px] font-black">
                                                {(currentPage - 1) * 3 + index + 1}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                                {doc.title}
                                            </h3>

                                            {activeCategory?.slug === "sop" ? (
                                                <p className="mt-1.5 text-[11px] font-black leading-snug text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                    Bidang: {doc.description || "Layanan Sub Bagian Tata Usaha"}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-col items-end gap-3 shrink-0">
                                            <div className="flex flex-wrap items-center justify-end gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="4"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    {doc.view_count || 0} Lihat
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="4"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                    {doc.download_count || 0} Unduh
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {new Date(doc.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`/api/laporan/view/${doc.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Preview"
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-400 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white dark:border-slate-800 dark:bg-transparent dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                                                >
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </a>

                                                <button
                                                    type="button"
                                                    title="Edit"
                                                    onClick={() => onStartEdit(doc)}
                                                    disabled={isBusy}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-transparent bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                                                >
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>

                                                <button
                                                    type="button"
                                                    title={doc.is_published ? "Unpublish" : "Publish"}
                                                    onClick={() => onTogglePublish(doc)}
                                                    disabled={isBusy}
                                                    className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 border-transparent transition-all disabled:opacity-50 ${doc.is_published ? "bg-amber-50 text-amber-500 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50" : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50"}`}
                                                >
                                                    {isPublishing ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    ) : doc.is_published ? (
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                    ) : (
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Hapus"
                                                    onClick={() => onDelete(doc.id)}
                                                    disabled={isBusy}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-transparent bg-rose-50 text-rose-500 transition-all hover:bg-rose-100 hover:text-rose-600 disabled:opacity-50 dark:bg-rose-900/30 dark:hover:bg-rose-900/50"
                                                >
                                                    {isDeleting ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    ) : (
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    )}
                                                </button>
                                            </div>
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
                                            {activeCategory?.slug === "sop" && (
                                                <div className="space-y-2 relative">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50 dark:text-black/50 ml-1">
                                                        SOP Bidang <span className="text-rose-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                                                            className="flex w-full h-12 items-center justify-between rounded-2xl border-2 px-4 text-xs font-bold outline-none transition-all !bg-white/5 !border-white/20 !text-white dark:!bg-black/5 dark:!border-black/20 dark:!text-black text-left"
                                                        >
                                                            <span>{editForm.description || "Layanan Sub Bagian Tata Usaha"}</span>
                                                            <svg viewBox="0 0 24 24" className={`h-4 w-4 text-white/50 dark:text-black/50 transition-transform duration-300 ${isEditDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                        
                                                        {isEditDropdownOpen && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    tabIndex={-1}
                                                                    className="fixed inset-0 z-20 cursor-default"
                                                                    onClick={() => setIsEditDropdownOpen(false)}
                                                                />
                                                                <div className="absolute left-0 right-0 mt-2 py-2 bg-slate-900 dark:bg-white border border-white/10 dark:border-black/10 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                                                    {BIDANG_LIST.map((bidang) => (
                                                                        <button
                                                                            key={bidang}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setEditForm((p) => ({ ...p, description: bidang }));
                                                                                setIsEditDropdownOpen(false);
                                                                            }}
                                                                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all hover:bg-white/10 dark:hover:bg-black/10 ${editForm.description === bidang || (!editForm.description && bidang === "Layanan Sub Bagian Tata Usaha") ? "text-emerald-400 dark:text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/10" : "text-white dark:text-black"}`}
                                                                        >
                                                                            {bidang}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

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

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 dark:text-black/50 ml-1">Update File</label>
                                                <div 
                                                    className="relative group mt-1"
                                                    onDragOver={handleDragOverEdit}
                                                    onDragLeave={handleDragLeaveEdit}
                                                    onDrop={handleDropEdit}
                                                >
                                                    <input
                                                        id={`pdf-edit-input-${doc.id}`}
                                                        type="file"
                                                        accept="application/pdf,.pdf"
                                                        onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className={`flex flex-col items-center justify-center min-h-[120px] w-full rounded-2xl border-2 border-dashed px-5 py-6 transition-all ${isDraggingEdit ? "border-emerald-500 bg-emerald-500/20 dark:bg-emerald-500/20" : "border-white/20 bg-white/5 group-hover:border-white/50 dark:border-black/20 dark:bg-black/5 dark:group-hover:border-black/50"}`}>
                                                        {editFile ? (
                                                            <>
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white dark:bg-emerald-500 dark:text-white mb-3">
                                                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                                                                        <path d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-xs font-bold text-white dark:text-black truncate max-w-full px-2 text-center">
                                                                    {editFile.name}
                                                                </span>
                                                                <span className="text-[10px] font-medium text-white/50 dark:text-black/50 mt-1">Klik atau seret file PDF lain untuk mengganti</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors mb-3 ${isDraggingEdit ? "bg-emerald-500 text-white" : "bg-white/10 text-white/50 dark:bg-black/10 dark:text-black/50 group-hover:bg-white group-hover:text-black dark:group-hover:bg-black dark:group-hover:text-white"}`}>
                                                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                        <path d="M12 4v12m0-12l-4 4m4-4l4 4M4 20h16" />
                                                                    </svg>
                                                                </div>
                                                                <span className={`text-[11px] font-black uppercase tracking-widest text-center ${isDraggingEdit ? "text-emerald-500" : "text-white/60 dark:text-black/60 group-hover:text-white dark:group-hover:text-black"}`}>
                                                                    {isDraggingEdit ? "Lepaskan File PDF di sini" : "Pilih / Drag File PDF Baru"}
                                                                </span>
                                                            </>
                                                        )}
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
