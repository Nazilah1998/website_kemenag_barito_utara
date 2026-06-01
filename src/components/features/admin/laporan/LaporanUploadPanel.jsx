// src/components/admin/laporan/LaporanUploadPanel.jsx
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
    selectedFile,
    setSelectedFile,
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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
                setSelectedFile(file);
            } else {
                alert("Hanya file PDF yang diizinkan.");
            }
        }
    };

    return (
        <section
            className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-700"
            aria-labelledby="laporan-upload-title"
            aria-busy={savingDocument}
        >
            <div className="mb-8 pb-6 border-b-2 border-slate-900 dark:border-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-black mb-5">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 4v12m0-12l-4 4m4-4l4 4M4 20h16" />
                    </svg>
                </div>
                <h2
                    id="laporan-upload-title"
                    className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none"
                >
                    Upload Baru
                </h2>
                <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Kategori: <span className="text-slate-900 dark:text-white underline decoration-emerald-500 decoration-2 underline-offset-4">{activeCategory?.title || "—"}</span>
                </p>
            </div>

            <form className="flex-1 space-y-6" onSubmit={handleUpload} noValidate>
                <div className="space-y-6">
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
                                                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 ${docForm.description === bidang || (!docForm.description && bidang === "Layanan Sub Bagian Tata Usaha") ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20" : "text-slate-700 dark:text-slate-300"}`}
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
                        label="Judul Dokumen"
                        required
                        className="!h-12"
                        placeholder="Masukkan judul resmi..."
                        hint="Gunakan bahasa Indonesia yang baku."
                        value={docForm.title}
                        onChange={(e) => setDocForm((prev) => ({ ...prev, title: e.target.value }))}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
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
                            File PDF <span className="text-rose-500">*</span>
                        </label>
                        <div 
                            className="relative group mt-1"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                id="pdf-upload-input"
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`flex flex-col items-center justify-center min-h-[120px] w-full rounded-2xl border-2 border-dashed px-5 py-6 transition-all ${isDragging ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20" : "border-slate-200 bg-slate-50/50 group-hover:border-slate-900 dark:border-slate-800 dark:bg-slate-800/30 dark:group-hover:border-white"}`}>
                                {selectedFile || docForm.file_name ? (
                                    <>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 mb-3">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full px-2 text-center">
                                            {selectedFile?.name || docForm.file_name}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-400 mt-1">Klik atau seret file PDF lain untuk mengganti</span>
                                    </>
                                ) : (
                                    <>
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors mb-3 ${isDragging ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black"}`}>
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M12 4v12m0-12l-4 4m4-4l4 4M4 20h16" />
                                            </svg>
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-widest text-center ${isDragging ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                                            {isDragging ? "Lepaskan File PDF di sini" : "Pilih / Drag File PDF"}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/30">
                        <label className="flex cursor-pointer items-center gap-4">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={docForm.is_published}
                                    onChange={(e) =>
                                        setDocForm((prev) => ({ ...prev, is_published: e.target.checked }))
                                    }
                                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 bg-white transition-all checked:border-slate-900 checked:bg-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:checked:border-white dark:checked:bg-white"
                                />
                                <svg className="pointer-events-none absolute h-6 w-6 p-1 text-white opacity-0 transition-opacity peer-checked:opacity-100 dark:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5">
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white block">
                                    Publikasikan Langsung
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                <Feedback {...uploadFeedback} />

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="submit"
                        loading={savingDocument}
                        size="md"
                        className="w-full sm:flex-1 h-12"
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
                        className="w-full sm:w-auto h-12"
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </section>
    );
}