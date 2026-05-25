"use client";

import React, { useState } from "react";
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

export default function LaporanDocumentsClient({ documents = [], categorySlug }) {
    const { isDownloading, handleDownload } = useDocumentActions();
    const [expandedBidang, setExpandedBidang] = useState(null);

    if (!documents.length) {
        return (
            <div className="w-full rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
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

    if (categorySlug === "sop-dan-standar-pelayanan") {
        return (
            <div className="w-full space-y-4">
                {BIDANG_LIST.map((bidang, index) => {
                    const bidangDocs = documents.filter(
                        (doc) => (doc.description || "Layanan Sub Bagian Tata Usaha") === bidang
                    );
                    const isExpanded = expandedBidang === bidang;

                    return (
                        <div
                            key={bidang}
                            className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900/40"
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => setExpandedBidang(isExpanded ? null : bidang)}
                                className="flex w-full items-center justify-between px-6 py-5 text-left transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[11px] font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {bidang}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-1.5">
                                            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                UNIT
                                            </span>
                                            <span className="text-[9px] font-semibold text-slate-400">
                                                {bidangDocs.length} {bidangDocs.length === 1 ? "Item" : "Items"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-transform duration-300 dark:bg-slate-800/50 ${isExpanded ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {/* Accordion Content */}
                            {isExpanded && (
                                <div className="border-t border-slate-100 bg-slate-50/30 p-6 dark:border-slate-800/60">
                                    {bidangDocs.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {bidangDocs.map((doc, idx) => (
                                                <DocumentItem
                                                    key={doc.id}
                                                    doc={doc}
                                                    index={idx}
                                                    loading={isDownloading === doc.href}
                                                    onDownload={handleDownload}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                                            Belum Ada SOP Tersedia Untuk Bidang Ini
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    return documents.map((doc, index) => (
        <DocumentItem
            key={doc.id}
            doc={doc}
            index={index}
            loading={isDownloading === doc.href}
            onDownload={handleDownload}
        />
    ));
}

