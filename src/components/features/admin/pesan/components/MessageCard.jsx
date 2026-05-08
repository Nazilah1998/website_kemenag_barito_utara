import React from "react";

export default function MessageCard({ msg, idx, onOpen, onDelete }) {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-50 bg-white p-6 shadow-xl shadow-slate-200/30 dark:border-white/5 dark:bg-slate-900">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-700 mb-1">Entry #{String(idx + 1).padStart(3, '0')}</div>
                    <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white leading-tight">{msg.nama}</h3>
                    <p className="mt-1 text-xs font-bold text-slate-400">{msg.whatsapp}</p>
                </div>
                <div className={`rounded-xl px-4 py-2 border-2 ${msg.status.toLowerCase() === "baru" ? "bg-amber-500/10 border-amber-500/20 text-amber-600" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest">{msg.status}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
                <span className={`rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${msg.subjek === "Pengaduan" ? "bg-rose-500 text-white" : msg.subjek === "Pertanyaan" ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"}`}>
                    {msg.subjek}
                </span>
                <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-white/10" />
                <span className="text-[10px] font-black uppercase text-slate-400">
                    {new Date(msg.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-slate-50 dark:border-white/5">
                <button
                    onClick={() => onOpen(msg)}
                    className="flex h-12 items-center justify-center rounded-2xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white dark:bg-white dark:text-black"
                >
                    Rincian
                </button>
                <button
                    onClick={() => onDelete(msg.id)}
                    className="flex h-12 items-center justify-center rounded-2xl border-2 border-rose-50 text-rose-500 dark:border-rose-900/20"
                >
                    Hapus
                </button>
            </div>
        </div>
    );
}
