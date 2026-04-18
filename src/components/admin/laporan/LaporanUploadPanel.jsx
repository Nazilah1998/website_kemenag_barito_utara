// src/components/admin/laporan/LaporanUploadPanel.jsx
"use client";

import { Button, Feedback, Input, Textarea } from "./LaporanUi";

export default function LaporanUploadPanel({
    activeCategory,
    docForm,
    setDocForm,
    setSelectedFile,
    savingDocument,
    uploadFeedback,
    onSubmit,
    onReset,
}) {
    const currentYear = new Date().getFullYear();

    return (
        <section
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            aria-labelledby="laporan-upload-title"
            aria-busy={savingDocument}
        >
            <div className="mb-5">
                <h2
                    id="laporan-upload-title"
                    className="text-base font-bold text-slate-900 dark:text-slate-100"
                >
                    Upload Dokumen PDF
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Dokumen akan masuk ke kategori{" "}
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {activeCategory?.title || "—"}
                    </span>
                    .
                </p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit} noValidate>
                <Input
                    inputId="laporan-title"
                    label="Judul Dokumen"
                    required
                    placeholder="Contoh: Laporan Kinerja Tahun 2025"
                    hint="Masukkan judul resmi dokumen."
                    value={docForm.title}
                    onChange={(e) => setDocForm((prev) => ({ ...prev, title: e.target.value }))}
                />

                <Textarea
                    inputId="laporan-description"
                    label="Deskripsi Singkat"
                    placeholder="Ringkasan isi dokumen (opsional)..."
                    hint="Deskripsi membantu admin lain memahami isi dokumen."
                    value={docForm.description}
                    onChange={(e) => setDocForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        inputId="laporan-year"
                        label="Tahun Dokumen"
                        type="number"
                        min="2000"
                        max="2100"
                        placeholder={String(currentYear)}
                        hint="Tahun publikasi resmi dokumen."
                        value={docForm.year}
                        onChange={(e) => setDocForm((prev) => ({ ...prev, year: e.target.value }))}
                    />

                    <label className="block space-y-1.5" htmlFor="pdf-upload-input">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            File PDF <span className="text-rose-500">*</span>
                        </span>
                        <input
                            id="pdf-upload-input"
                            type="file"
                            accept="application/pdf,.pdf"
                            aria-describedby="pdf-upload-hint"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:file:bg-emerald-900 dark:file:text-emerald-300"
                        />
                        <span id="pdf-upload-hint" className="block text-xs text-slate-500 dark:text-slate-400">
                            Hanya file PDF, maks. 10 MB.
                        </span>
                    </label>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750">
                    <input
                        type="checkbox"
                        checked={docForm.is_published}
                        onChange={(e) =>
                            setDocForm((prev) => ({ ...prev, is_published: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-slate-300 accent-emerald-600 dark:border-slate-600"
                    />
                    <div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Langsung publish setelah upload
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Jika tidak dicentang, dokumen tersimpan sebagai draft.
                        </p>
                    </div>
                </label>

                <Feedback {...uploadFeedback} />

                <div className="flex flex-wrap gap-3 pt-1">
                    <Button
                        type="submit"
                        loading={savingDocument}
                        loadingText="Mengupload…"
                    >
                        Upload Dokumen
                    </Button>
                    <Button type="button" tone="ghost" onClick={onReset} disabled={savingDocument}>
                        Reset Form
                    </Button>
                </div>
            </form>
        </section>
    );
}