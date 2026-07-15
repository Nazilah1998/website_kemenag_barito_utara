// src/components/features/admin/laporan/LaporanUploadPanel.jsx
"use client";

import React from "react";
import { Button, Feedback, Input, Textarea } from "./LaporanUi";

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

export default function LaporanUploadPanel({
    activeCategory,
    docForm,
    setDocForm,
    selectedFiles = [],
    setSelectedFiles,
    savingDocument,
    uploadFeedback,
    handleUpload,
    resetForm,
}) {
    const currentYear = new Date().getFullYear();
    const [isDragging, setIsDragging] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files).filter(
                (file) => file.type === "application/pdf" || file.name.endsWith(".pdf")
            );
            if (files.length > 0) {
                setSelectedFiles(files);
            } else {
                alert("Hanya file PDF yang diizinkan.");
            }
        }
    };

    return (
        <section
            className="relative flex flex-col h-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-white to-slate-50/50 border border-slate-100 shadow-2xl shadow-emerald-900/5 p-5 sm:p-8 md:p-10 dark:from-slate-900 dark:to-slate-900/50 dark:border-slate-800 dark:shadow-emerald-500/5 animate-in fade-in slide-in-from-left-4 duration-700"
            aria-labelledby="laporan-upload-title"
            aria-busy={savingDocument}
        >
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-slate-200/60 dark:border-slate-700/60 flex items-start gap-4 sm:gap-5">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-[1rem] sm:rounded-[1.25rem] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/10">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <div>
                    <h2
                        id="laporan-upload-title"
                        className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase"
                    >
                        Upload Baru
                    </h2>
                    <p className="mt-1 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                        {activeCategory?.title || "—"}
                    </p>
                </div>
            </div>

            <form className="flex-1 space-y-4 sm:space-y-6" onSubmit={handleUpload} noValidate>
                <div className="space-y-4 sm:space-y-6">
                    {activeCategory?.slug === "sop" && (
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100 ml-1">
                                SOP Bidang <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex w-full h-12 items-center justify-between rounded-2xl border-2 bg-slate-50/50 px-4 text-xs font-bold text-slate-700 outline-none transition-all border-slate-200 hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-350 dark:hover:border-white text-left"
                                >
                                    <span>{docForm.description || "Layanan Sub Bagian Tata Usaha"}</span>
                                    <svg viewBox="0 0 24 24" className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {isDropdownOpen && (
                                    <>
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="fixed inset-0 z-20 cursor-default"
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <div className="absolute left-0 right-0 mt-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                            {BIDANG_LIST.map((bidang) => (
                                                <button
                                                    key={bidang}
                                                    type="button"
                                                    onClick={() => {
                                                        setDocForm((prev) => ({ ...prev, description: bidang }));
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 ${docForm.description === bidang || (!docForm.description && bidang === "Layanan Sub Bagian Tata Usaha") ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20" : "text-slate-700 dark:text-slate-300"}`}
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

                    <Input
                        inputId="laporan-title"
                        label="Judul Dokumen (Bisa Kosong Jika Banyak File)"
                        className="!h-12"
                        placeholder="Masukkan judul resmi..."
                        hint="Jika kosong pada upload massal, judul akan diambil dari nama file."
                        value={docForm.title}
                        onChange={(e) => setDocForm((prev) => ({ ...prev, title: e.target.value }))}
                    />

                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                        <Input
                            inputId="laporan-year"
                            label="Tahun"
                            type="number"
                            className="!h-12"
                            placeholder={String(currentYear)}
                            value={docForm.year}
                            onChange={(e) => setDocForm((prev) => ({ ...prev, year: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100 ml-1">
                            File PDF (Bisa Pilih Banyak) <span className="text-rose-500">*</span>
                        </label>
                        <div 
                            className="relative group mt-1 w-full min-w-0"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                id="pdf-upload-input"
                                type="file"
                                accept="application/pdf,.pdf"
                                multiple
                                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`relative flex flex-col items-center justify-center min-h-[160px] w-full min-w-0 overflow-hidden rounded-[1.5rem] border-2 border-dashed px-6 py-8 transition-all duration-300 ${isDragging ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 scale-[1.02] shadow-xl shadow-emerald-500/20" : "border-slate-200 bg-white/50 hover:bg-white hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-emerald-500 dark:hover:bg-slate-800"}`}>
                                {selectedFiles?.length > 0 ? (
                                    <>
                                        <div className="relative shrink-0 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 dark:from-emerald-900/60 dark:to-emerald-800/40 dark:text-emerald-400 mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            <div className="absolute inset-0 rounded-[1.25rem] border border-white/40 dark:border-emerald-400/20" />
                                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="w-full min-w-0 max-w-full px-2 text-center flex flex-col items-center">
                                            <span className="block w-full max-w-full line-clamp-2 break-all text-sm font-bold text-slate-900 dark:text-white">
                                                {selectedFiles.length} file dipilih
                                            </span>
                                            {selectedFiles.length === 1 && (
                                                <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400 truncate w-full">{selectedFiles[0].name}</span>
                                            )}
                                            <span className="text-[10px] font-bold text-slate-500 mt-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/30 dark:group-hover:text-emerald-400">Klik atau seret file PDF lain untuk mengganti</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={`relative flex h-14 w-14 items-center justify-center rounded-[1.25rem] transition-all duration-300 mb-4 ${isDragging ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-110" : "bg-white text-slate-400 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-200 dark:group-hover:bg-emerald-900/40 dark:group-hover:text-emerald-400"}`}>
                                            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0-12l-4 4m4-4l4 4M4 20h16" />
                                            </svg>
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-widest text-center transition-colors ${isDragging ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"}`}>
                                            {isDragging ? "Lepaskan PDF di sini" : "Pilih / Drag Beberapa File PDF"}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm p-4 sm:p-5 transition-all hover:border-emerald-200 hover:shadow-emerald-500/5 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-emerald-500/30">
                        <label className="flex cursor-pointer items-center gap-4 group/publish">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={docForm.is_published}
                                    onChange={(e) =>
                                        setDocForm((prev) => ({ ...prev, is_published: e.target.checked }))
                                    }
                                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-slate-50 transition-all checked:border-emerald-500 checked:bg-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:checked:border-emerald-500 dark:checked:bg-emerald-500"
                                />
                                <svg className="pointer-events-none absolute h-6 w-6 p-1 text-white opacity-0 transition-opacity peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5">
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white block group-hover/publish:text-emerald-600 dark:group-hover/publish:text-emerald-400 transition-colors">
                                    Publikasikan Langsung
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                <Feedback {...uploadFeedback} />

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-200/60 dark:border-slate-700/60 mt-auto">
                    <Button
                        type="submit"
                        loading={savingDocument}
                        size="md"
                        className="w-full sm:flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 border-0"
                        icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>}
                    >
                        Simpan Dokumen
                    </Button>
                    <Button
                        type="button"
                        tone="ghost"
                        size="md"
                        onClick={resetForm}
                        disabled={savingDocument}
                        className="w-full sm:w-auto h-12 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 bg-white dark:bg-slate-900"
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </section>
    );
}