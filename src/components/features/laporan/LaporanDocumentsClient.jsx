"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewerClient"), { ssr: false });

function DownloadIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h6" />
            <path d="M9 17h6" />
            <path d="M9 9h1" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export default function LaporanDocumentsClient({ documents = [] }) {
    const [openDocId, setOpenDocId] = useState(null);
    const [failedPreviewById, setFailedPreviewById] = useState({});
    const [isDownloading, setIsDownloading] = useState(null);

    const handleDownload = async (url, fileName) => {
        setIsDownloading(url);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback to direct link if fetch fails (e.g. CORS)
            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.download = fileName;
            link.click();
        } finally {
            setIsDownloading(null);
        }
    };

    if (!documents.length) {
        return (
            <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center lg:col-span-2 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 text-slate-300 dark:bg-white/5">
                    <FileIcon />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Arsip Masih Kosong</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    Dokumen untuk kategori ini belum tersedia untuk publik. Silakan cek kembali di lain waktu.
                </p>
            </div>
        );
    }

    return documents.map((doc, index) => {
        const isOpen = openDocId === doc.id;
        const failed = Boolean(failedPreviewById[doc.id]);
        const loading = isDownloading === doc.href;

        return (
            <article
                key={doc.id}
                className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${isOpen
                    ? "border-emerald-500 bg-white shadow-2xl shadow-emerald-500/10 dark:bg-slate-900 lg:col-span-2"
                    : "border-slate-200 bg-white p-8 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50"
                    }`}
            >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_45%)]" />

                <div className={isOpen ? "p-8 lg:p-12" : "relative"}>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-1 items-start gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform duration-500 group-hover:scale-105 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <FileIcon />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Dokumen 0{index + 1}</span>
                                    <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <span className="text-emerald-500/70">Public Access</span>
                                </div>
                                <h3 className={`mt-2 font-bold leading-tight text-slate-900 dark:text-white transition-all ${isOpen ? "text-2xl lg:text-3xl" : "text-lg"}`}>
                                    {doc.title}
                                </h3>

                                {doc.description && (
                                    <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                        {doc.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                            <div className="flex gap-2">
                                {doc.year && (
                                    <div className="rounded-xl bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        Tahun {doc.year}
                                    </div>
                                )}
                                <div className="rounded-xl border border-slate-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800">
                                    PDF Format
                                </div>
                            </div>

                            {typeof doc.view_count === "number" && (
                                <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-300 dark:text-slate-700 uppercase">
                                    <EyeIcon />
                                    <span>Diakses {doc.view_count.toLocaleString("id-ID")} Kali</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => {
                                if (isOpen) {
                                    setOpenDocId(null);
                                    return;
                                }
                                setFailedPreviewById((prev) => ({ ...prev, [doc.id]: false }));
                                setOpenDocId(doc.id);
                            }}
                            className={`flex h-12 flex-1 items-center justify-center gap-3 rounded-2xl text-xs font-bold transition-all active:scale-95 ${isOpen
                                ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-xl"
                                : "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                                }`}
                        >
                            {isOpen ? <CloseIcon /> : <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                            <span>{isOpen ? "Tutup Dokumen" : "Pratinjau Dokumen"}</span>
                        </button>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleDownload(doc.href, doc.title)}
                            className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 text-xs font-bold text-slate-500 transition-all hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 sm:w-auto"
                        >
                            {loading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                            ) : (
                                <DownloadIcon />
                            )}
                            <span className="hidden sm:inline">{loading ? "Downloading..." : "Download"}</span>
                        </button>
                    </div>

                    {isOpen && (
                        <div className="mt-12 animate-in fade-in zoom-in slide-in-from-top-4 duration-500">
                            <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 shadow-2xl dark:border-white/5 dark:bg-slate-950">
                                <div className="flex items-center justify-between border-b border-white/10 bg-emerald-950 p-4 lg:px-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">PDF Reader v2.0</span>
                                    </div>
                                    <button onClick={() => setOpenDocId(null)} className="text-white/40 hover:text-white transition-colors">
                                        <CloseIcon />
                                    </button>
                                </div>

                                <div className="p-4 sm:p-8 dark:bg-black/20">
                                    {failed ? (
                                        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-900/20">
                                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Pratinjau Gagal</h4>
                                            <p className="max-w-xs text-xs text-slate-500 dark:text-slate-400">
                                                Dokumen tidak dapat dimuat. Silakan unduh file untuk melihat rincian lengkap.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setFailedPreviewById((prev) => ({ ...prev, [doc.id]: false }))}
                                                className="mt-2 rounded-full bg-emerald-600 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20"
                                            >
                                                Coba Muat Ulang
                                            </button>
                                        </div>
                                    ) : (
                                        <PdfViewer
                                            fileUrl={doc.href}
                                            fileName={`${doc.title || "dokumen"}.pdf`}
                                            onError={() => setFailedPreviewById((prev) => ({ ...prev, [doc.id]: true }))}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </article>
        );
    });
}
