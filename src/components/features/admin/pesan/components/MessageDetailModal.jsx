import React from "react";

export default function MessageDetailModal({ msg, onClose, onUpdateStatus }) {
    if (!msg) return null;

    const isBaru = msg.status.toLowerCase() === "baru";
    const isPengaduan = msg.subjek === "Pengaduan";

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            {/* Modal Content */}
            <div className="relative flex w-full max-w-lg flex-col overflow-hidden bg-white shadow-xl sm:rounded-2xl dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                
                {/* Header section with top accent bar */}
                <div className={`h-1.5 w-full ${isPengaduan ? "bg-rose-500" : "bg-emerald-500"}`} />
                
                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                {msg.nama}
                            </h2>
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
                                isPengaduan 
                                    ? "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20" 
                                    : "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                            }`}>
                                {msg.subjek}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {msg.whatsapp}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                    >
                        <span className="sr-only">Tutup</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body section */}
                <div className="px-6 py-7 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="relative text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.pesan}
                    </div>
                    
                    <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 font-medium">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <time dateTime={msg.created_at}>
                            {new Date(msg.created_at).toLocaleString("id-ID", { 
                                day: 'numeric', month: 'long', year: 'numeric', 
                                hour: '2-digit', minute: '2-digit' 
                            }).replace(/\./g, ':')} WIB
                        </time>
                    </div>
                </div>

                {/* Footer section */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 flex justify-end">
                    <button
                        onClick={() => {
                            const newStatus = isBaru ? "selesai" : "baru";
                            onUpdateStatus(msg.id, newStatus);
                        }}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none ${
                            isBaru
                                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm dark:bg-emerald-600 dark:hover:bg-emerald-700"
                                : "bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 shadow-sm dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
                        }`}
                    >
                        {isBaru ? (
                            <>
                                Tandai Selesai
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </>
                        ) : (
                            <>
                                Buka Kembali
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
