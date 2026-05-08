import React from "react";

export default function MessageDetailModal({ msg, onClose, onUpdateStatus }) {
    if (!msg) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onClose} />
            <div className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-[3rem] dark:bg-slate-900">
                {/* Modal Header */}
                <div className="shrink-0 flex items-center justify-between border-b-2 border-slate-50 px-8 py-8 dark:border-white/5">
                    <div>
                        <span className={`rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${msg.subjek === "Pengaduan" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}>
                            {msg.subjek}
                        </span>
                        <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">{msg.nama}</h2>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{msg.whatsapp}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:bg-white/5"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="relative rounded-[2.5rem] border-2 border-slate-50 bg-slate-50/50 p-10 dark:border-white/5 dark:bg-white/5">
                        <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-bold">
                            &ldquo;{msg.pesan}&rdquo;
                        </p>
                        <div className="mt-10 flex flex-col gap-1 border-t-2 border-slate-100 pt-8 dark:border-white/10">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Direkam pada</span>
                            <span className="text-xs font-bold text-slate-500">
                                {new Date(msg.created_at).toLocaleString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="shrink-0 p-8 border-t-2 border-slate-50 dark:border-white/5">
                    <button
                        onClick={() => {
                            const newStatus = msg.status.toLowerCase() === "baru" ? "selesai" : "baru";
                            onUpdateStatus(msg.id, newStatus);
                        }}
                        className={`group relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all active:scale-95 shadow-2xl ${msg.status.toLowerCase() === "baru"
                            ? "bg-emerald-600 shadow-emerald-600/20"
                            : "bg-amber-500 shadow-amber-500/20"
                            }`}
                    >
                        <span className="relative z-10">{msg.status.toLowerCase() === "baru" ? "Selesaikan Pesan" : "Buka Kembali Sesi"}</span>
                        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                    </button>
                </div>
            </div>
        </div>
    );
}
