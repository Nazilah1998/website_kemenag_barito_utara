"use client";

import React from "react";
import { useDocumentActions } from "./hooks/useDocumentActions";
import DocumentItem from "./components/DocumentItem";

function FileIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h6" />
            <path d="M9 17h6" />
            <path d="M9 9h1" />
        </svg>
    );
}

export default function LaporanDocumentsClient({ documents = [] }) {
    const {
        openDocId,
        setOpenDocId,
        failedPreviewById,
        isDownloading,
        handleDownload,
        togglePreview,
        setFailedPreview
    } = useDocumentActions();

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

    return documents.map((doc, index) => (
        <DocumentItem
            key={doc.id}
            doc={doc}
            index={index}
            isOpen={openDocId === doc.id}
            failed={Boolean(failedPreviewById[doc.id])}
            loading={isDownloading === doc.href}
            onTogglePreview={togglePreview}
            onDownload={handleDownload}
            onClosePreview={() => setOpenDocId(null)}
            onRetryPreview={(isFailed = false) => setFailedPreview(doc.id, isFailed)}
        />
    ));
}
