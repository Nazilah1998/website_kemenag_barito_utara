"use client";

import { useEffect } from "react";

function buildPdfPreviewUrl(url) {
    const raw = String(url || "").trim();
    if (!raw) return "";

    if (/\.pdf([?#].*)?$/i.test(raw)) {
        const separator = raw.includes("#") ? "&" : "#";
        return `${raw}${separator}toolbar=1&navpanes=0&scrollbar=1&view=FitH`;
    }

    return raw;
}

export default function PdfViewerModal({ open, title, url, onClose }) {
    const previewUrl = buildPdfPreviewUrl(url);

    useEffect(() => {
        if (!open) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open || !previewUrl) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title || "Preview PDF"}
            onClick={onClose}
        >
            <div
                className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-950"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                            {title || "Preview Dokumen"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            PDF dibuka langsung di halaman ini. Jika browser memblokir
                            pratinjau, gunakan tombol tab baru.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Buka Tab Baru
                        </a>
                        <a
                            href={url}
                            download
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                            Download
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                            Tutup
                        </button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 bg-slate-100 dark:bg-slate-900">
                    <iframe
                        src={previewUrl}
                        title={title || "Preview PDF"}
                        className="h-full w-full"
                    />
                </div>
            </div>
        </div>
    );
}