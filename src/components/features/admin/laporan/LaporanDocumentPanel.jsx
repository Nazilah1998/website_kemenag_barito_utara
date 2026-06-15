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
            <div className="mb-5 sm:mb-8 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-slate-900 pb-4 sm:pb-6 dark:border-white">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 mb-1.5">Data Terverifikasi</p>
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
                                className={`group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-300 ${isEditing
                                    ? "border-emerald-500/50 bg-emerald-50/30 shadow-2xl shadow-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-900/10 scale-[1.01] z-20"
                                    : "border-slate-200/60 bg-white hover:bg-slate-50/50 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-500/30 dark:hover:bg-slate-900"
                                    }`}
                            >
                                {!isEditing ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-5 sm:p-6">
                                        <div className="flex items-center gap-3 mb-1 sm:mb-0">
                                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[1rem] bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 shadow-inner group-hover:from-emerald-400 group-hover:to-emerald-600 group-hover:text-white transition-all duration-300 dark:from-slate-800 dark:to-slate-700 dark:text-slate-300 dark:group-hover:from-emerald-600 dark:group-hover:to-emerald-800">
                                                <span className="text-xs font-black">
                                                    {(currentPage - 1) * 3 + index + 1}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                                                {doc.title}
                                            </h3>

                                            {activeCategory?.slug === "sop" ? (
                                                <p className="mt-1.5 text-[11px] font-black leading-snug text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                                    Bidang: {doc.description || "Layanan Sub Bagian Tata Usaha"}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 dark:border-slate-800 sm:border-0">
                                            <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 w-full sm:w-auto">
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

                                            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                                <a
                                                    href={`/api/laporan/view/${doc.id}/${doc.file_name || 'dokumen.pdf'}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Preview"
                                                    className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-slate-200 bg-white text-slate-500 transition-all hover:scale-105 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                                >
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </a>

                                                <button
                                                    type="button"
                                                    title="Edit"
                                                    onClick={() => onStartEdit(doc)}
                                                    disabled={isBusy}
                                                    className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-slate-200 bg-white text-slate-500 transition-all hover:scale-105 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-amber-500/50 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
                                                >
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>

                                                <button
                                                    type="button"
                                                    title={doc.is_published ? "Unpublish" : "Publish"}
                                                    onClick={() => onTogglePublish(doc)}
                                                    disabled={isBusy}
                                                    className={`flex h-10 w-10 items-center justify-center rounded-[1rem] border transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 ${doc.is_published ? "border-amber-200 bg-amber-50 text-amber-600 hover:border-amber-300 hover:shadow-amber-500/20 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400" : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:border-emerald-300 hover:shadow-emerald-500/20 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400"}`}
                                                >
                                                    {isPublishing ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    ) : doc.is_published ? (
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                    ) : (
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Hapus"
                                                    onClick={() => onDelete(doc.id)}
                                                    disabled={isBusy}
                                                    className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-rose-200 bg-rose-50 text-rose-500 transition-all hover:scale-105 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-600 hover:shadow-lg hover:shadow-rose-500/20 disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400"
                                                >
                                                    {isDeleting ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    ) : (
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-5 sm:p-8 animate-in fade-in duration-500">
                                        <div className="flex items-center justify-between mb-5 sm:mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 sm:pb-6">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Sistem Pembaruan</p>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Edit Dokumen</h3>
                                            </div>
                                            <button onClick={onCancelEdit} className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition-all">
                                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="4"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {activeCategory?.slug === "sop" && (
                                                <div className="space-y-2 relative">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 ml-1">
                                                        SOP Bidang <span className="text-rose-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                                                            className="flex w-full h-12 items-center justify-between rounded-2xl border-2 px-4 text-xs font-bold outline-none transition-all bg-white border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white text-left focus:border-emerald-500 dark:focus:border-emerald-500"
                                                        >
                                                            <span>{editForm.description || "Layanan Sub Bagian Tata Usaha"}</span>
                                                            <svg viewBox="0 0 24 24" className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isEditDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3">
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
                                                                <div className="absolute left-0 right-0 mt-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                                                    {BIDANG_LIST.map((bidang) => (
                                                                        <button
                                                                            key={bidang}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setEditForm((p) => ({ ...p, description: bidang }));
                                                                                setIsEditDropdownOpen(false);
                                                                            }}
                                                                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 ${editForm.description === bidang || (!editForm.description && bidang === "Layanan Sub Bagian Tata Usaha") ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" : "text-slate-700 dark:text-slate-300"}`}
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
                                                    className="!h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                                                />
 
                                                <Input
                                                    inputId={`edit-year-${doc.id}`}
                                                    label="Tahun"
                                                    type="number"
                                                    className="!h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-500"
                                                    value={editForm.year}
                                                    onChange={(e) => setEditForm((p) => ({ ...p, year: e.target.value }))}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">Update File</label>
                                                <div 
                                                    className="relative group mt-1 w-full min-w-0"
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
                                                    <div className={`relative flex flex-col items-center justify-center min-h-[160px] w-full min-w-0 overflow-hidden rounded-[1.5rem] border-2 border-dashed px-6 py-8 transition-all duration-300 ${isDraggingEdit ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 scale-[1.02] shadow-xl shadow-emerald-500/20" : "border-slate-200 bg-white hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500"}`}>
                                                        {editFile ? (
                                                            <>
                                                                <div className="relative shrink-0 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 dark:from-emerald-900/60 dark:to-emerald-800/40 dark:text-emerald-400 mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                                    <div className="absolute inset-0 rounded-[1.25rem] border border-white/40 dark:border-emerald-400/20" />
                                                                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="w-full min-w-0 max-w-full px-2 text-center flex flex-col items-center">
                                                                    <span className="block w-full max-w-full line-clamp-2 break-all text-sm font-bold text-slate-900 dark:text-white">
                                                                        {editFile.name}
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-slate-500 mt-3 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/30 dark:group-hover:text-emerald-400">Klik atau seret PDF lain untuk mengganti</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className={`relative flex h-14 w-14 items-center justify-center rounded-[1.25rem] transition-all duration-300 mb-4 ${isDraggingEdit ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-110" : "bg-slate-50 text-slate-400 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-200 dark:group-hover:bg-emerald-900/40 dark:group-hover:text-emerald-400"}`}>
                                                                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0-12l-4 4m4-4l4 4M4 20h16" />
                                                                    </svg>
                                                                </div>
                                                                <span className={`text-[11px] font-black uppercase tracking-widest text-center transition-colors ${isDraggingEdit ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"}`}>
                                                                    {isDraggingEdit ? "Lepaskan PDF di sini" : "Pilih / Drag File PDF Baru"}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <label className="flex cursor-pointer items-center gap-4 group/check bg-white p-4 rounded-xl border-2 border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(editForm.is_published)}
                                                        onChange={(e) => setEditForm((p) => ({ ...p, is_published: e.target.checked }))}
                                                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 bg-slate-50 transition-all checked:border-emerald-500 checked:bg-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:checked:border-emerald-500 dark:checked:bg-emerald-500"
                                                    />
                                                    <svg className="pointer-events-none absolute h-6 w-6 p-1 text-white opacity-0 transition-opacity peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5">
                                                        <path d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white block">Status Publikasi</span>
                                                </div>
                                            </label>

                                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 mt-4">
                                                <Button
                                                    type="button"
                                                    onClick={() => onSaveEdit(doc.id)}
                                                    loading={isSavingEdit}
                                                    className="w-full sm:flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 border-0"
                                                >
                                                    Simpan Perubahan
                                                </Button>
                                                <Button
                                                    type="button"
                                                    tone="ghost"
                                                    onClick={onCancelEdit}
                                                    disabled={isSavingEdit}
                                                    className="w-full sm:w-auto h-12 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
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
                        <div className="mt-8 sm:mt-12 flex flex-col items-center justify-between gap-5 sm:gap-6 border-t-2 border-slate-900 pt-6 sm:pt-8 dark:border-white lg:flex-row">
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
                <div className="relative flex flex-col items-center justify-center rounded-[2.5rem] sm:rounded-[3rem] border border-slate-200/60 bg-gradient-to-b from-white to-slate-50/30 py-20 sm:py-32 text-center shadow-xl shadow-slate-200/20 overflow-hidden dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/50 dark:shadow-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-100/50 via-transparent to-transparent dark:from-slate-800/50" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 mb-8 shadow-2xl shadow-emerald-500/10 dark:from-emerald-900/40 dark:to-emerald-800/20 dark:text-emerald-400 ring-8 ring-emerald-50/50 dark:ring-emerald-900/20 transition-transform duration-500 hover:scale-110">
                        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h3 className="relative text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Arsip Kosong</h3>
                    <p className="relative mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 max-w-sm mx-auto uppercase tracking-widest leading-relaxed">
                        Belum ada dokumen yang terverifikasi. Silakan unggah dokumen baru melalui panel di sebelah kiri.
                    </p>
                </div>
            )}
        </section>
    );
}
