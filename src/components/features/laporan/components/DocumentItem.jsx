import React from "react";

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

function EyeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export default function DocumentItem({
    doc,
    index
}) {
    return (
        <article
            className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border transition-all duration-500 border-slate-200 bg-white p-5 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50"
        >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_45%)]" />

            <div className="relative flex flex-col h-full justify-between">
                <div>
                    {/* Top row: Icon & Status badges */}
                    <div className="flex items-center justify-between gap-3 mb-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-transform duration-500 group-hover:scale-105 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <FileIcon />
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {doc.year && (
                                <span className="rounded-lg bg-slate-100 dark:bg-slate-850 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350">
                                    Tahun {doc.year}
                                </span>
                            )}
                            <span className="rounded-lg border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                PDF
                            </span>
                        </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Dokumen 0{index + 1}</span>
                            <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                            <span className="text-emerald-500/80">Akses Publik</span>
                        </div>
                        
                        <h3 className="mt-1.5 font-bold leading-snug text-slate-900 dark:text-white transition-all text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 line-clamp-2" title={doc.title}>
                            {doc.title}
                        </h3>
                    </div>
                </div>

                {/* Footer section: View Count and Preview Button */}
                <div className="mt-4">
                    {typeof doc.view_count === "number" && (
                        <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400 dark:text-slate-550 uppercase mb-2.5">
                            <EyeIcon />
                            <span>Diakses {doc.view_count.toLocaleString("id-ID")} Kali</span>
                        </div>
                    )}

                    <a
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9.5 w-full items-center justify-center gap-1.5 rounded-xl text-[11px] font-bold transition-all active:scale-95 bg-emerald-600 text-white shadow-lg shadow-emerald-600/10 hover:bg-emerald-700 hover:shadow-emerald-700/20"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Pratinjau Dokumen</span>
                    </a>
                </div>
            </div>
        </article>
    );
}

