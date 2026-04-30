// src/components/admin/laporan/LaporanUploadPanel.jsx
"use client";

import React from "react";
import { Button, Feedback, Input, Textarea } from "./LaporanUi";

export default function LaporanUploadPanel({
    activeCategory,
    docForm,
    setDocForm,
    setSelectedFile,
    savingDocument,
    uploadFeedback,
    handleUpload,
    resetForm,
}) {
    const currentYear = new Date().getFullYear();

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
                    className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none"
                >
                    Upload Baru
                </h2>
                <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Kategori: <span className="text-slate-900 dark:text-white underline decoration-emerald-500 decoration-2 underline-offset-4">{activeCategory?.title || "—"}</span>
                </p>
            </div>

            <form className="flex-1 space-y-6" onSubmit={handleUpload} noValidate>
                <div className="space-y-6">
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

                    <Textarea
                        inputId="laporan-description"
                        label="Ringkasan / Deskripsi"
                        placeholder="Jelaskan isi dokumen secara singkat (Opsional)..."
                        className="!min-h-[100px]"
                        value={docForm.description}
                        onChange={(e) => setDocForm((prev) => ({ ...prev, description: e.target.value }))}
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

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100 ml-1">
                                File PDF <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative group">
                                <input
                                    id="pdf-upload-input"
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex h-12 w-full items-center justify-between rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-5 transition-all group-hover:border-slate-900 dark:border-slate-800 dark:bg-slate-800/30 dark:group-hover:border-white">
                                    <span className="text-xs font-bold text-slate-400 truncate pr-4 uppercase tracking-widest">
                                        {docForm.file_name || "Pilih File PDF..."}
                                    </span>
                                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="4">
                                        <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </div>
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