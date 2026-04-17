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
    const titleError =
        uploadFeedback.type === "error" && !docForm.title.trim()
            ? "Judul dokumen wajib diisi."
            : "";

    return (
        <section
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            aria-labelledby="laporan-upload-title"
            aria-busy={savingDocument}
        >
            <h2
                id="laporan-upload-title"
                className="mb-1 text-base font-bold text-slate-900"
            >
                Upload Dokumen PDF
            </h2>
            <p className="mb-5 text-sm text-slate-500">
                File yang diupload otomatis masuk ke kategori{" "}
                <span className="font-semibold text-emerald-700">
                    {activeCategory?.title || "—"}
                </span>
                .
            </p>

            <form className="space-y-4" onSubmit={onSubmit}>
                <Input
                    inputId="laporan-title"
                    label="Judul Dokumen"
                    placeholder="Contoh: Laporan Kinerja Tahun 2025"
                    hint="Masukkan judul resmi dokumen agar mudah ditemukan."
                    error={titleError}
                    value={docForm.title}
                    onChange={(e) =>
                        setDocForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                />

                <Textarea
                    inputId="laporan-description"
                    label="Deskripsi Singkat"
                    placeholder="Ringkasan isi dokumen..."
                    hint="Deskripsi membantu admin lain memahami isi dokumen."
                    value={docForm.description}
                    onChange={(e) =>
                        setDocForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
                    }
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        inputId="laporan-year"
                        label="Tahun"
                        type="number"
                        min="2000"
                        max="2100"
                        placeholder="2025"
                        hint="Gunakan tahun publikasi dokumen."
                        value={docForm.year}
                        onChange={(e) =>
                            setDocForm((prev) => ({ ...prev, year: e.target.value }))
                        }
                    />

                    <label className="block space-y-2" htmlFor="pdf-upload-input">
                        <span className="text-sm font-semibold text-slate-800">
                            File PDF
                        </span>
                        <input
                            id="pdf-upload-input"
                            type="file"
                            accept="application/pdf,.pdf"
                            aria-describedby="pdf-upload-hint"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        <span id="pdf-upload-hint" className="block text-xs text-slate-500">
                            Hanya file PDF, maks. 10 MB.
                        </span>
                    </label>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                        type="checkbox"
                        checked={docForm.is_published}
                        onChange={(e) =>
                            setDocForm((prev) => ({
                                ...prev,
                                is_published: e.target.checked,
                            }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">
                        Langsung publish setelah upload
                    </span>
                </label>

                <Feedback {...uploadFeedback} />

                <div className="flex flex-wrap gap-3">
                    <Button
                        type="submit"
                        loading={savingDocument}
                        loadingText="Mengupload dokumen…"
                    >
                        Upload Dokumen
                    </Button>
                    <Button type="button" tone="ghost" onClick={onReset}>
                        Reset Form
                    </Button>
                </div>
            </form>
        </section>
    );
}