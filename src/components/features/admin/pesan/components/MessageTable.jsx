import React from "react";

export default function MessageTable({ messages, onOpen, onDelete }) {
    return (
        <div className="hidden lg:block overflow-hidden rounded-[2.5rem] border-2 border-slate-50 bg-white shadow-2xl shadow-slate-200/40 dark:border-white/5 dark:bg-slate-900 dark:shadow-none">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-slate-50 bg-slate-50/30 dark:border-white/5 dark:bg-white/5">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Opsi</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Kronologi</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identitas Pengirim</th>
                            <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50 dark:divide-white/5">
                        {messages.map((msg, idx) => (
                            <tr key={msg.id} className="group transition-all hover:bg-slate-50/50 dark:hover:bg-white/5">
                                <td className="px-8 py-6">
                                    <span className="text-xs font-black text-slate-200 dark:text-slate-800 uppercase">#{String(idx + 1).padStart(3, '0')}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-[11px] font-black uppercase text-slate-900 dark:text-white leading-none">
                                        {new Date(msg.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                    </div>
                                    <div className="mt-1.5 text-[10px] font-bold text-slate-400">
                                        {new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="font-black uppercase text-sm text-slate-900 dark:text-white">{msg.nama}</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${msg.subjek === "Pengaduan" ? "bg-rose-500 text-white" :
                                            msg.subjek === "Pertanyaan" ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"
                                            }`}>
                                            {msg.subjek}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400">{msg.whatsapp}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 border-2 ${msg.status.toLowerCase() === "baru"
                                        ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                        }`}>
                                        <div className={`h-1.5 w-1.5 rounded-full ${msg.status.toLowerCase() === "baru" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{msg.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-3 transition-all">
                                        <button
                                            onClick={() => onOpen(msg)}
                                            className="rounded-xl bg-slate-900 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
                                        >
                                            Buka Pesan
                                        </button>
                                        <button
                                            onClick={() => onDelete(msg.id)}
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white dark:border-rose-900/20"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
