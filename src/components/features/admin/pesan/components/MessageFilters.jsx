import React from "react";

export default function MessageFilters({
    filterSubjek,
    setFilterSubjek,
    filterStatus,
    setFilterStatus
}) {
    const subjekOptions = ["Semua", "Pertanyaan", "Masukan", "Pengaduan"];
    const statusOptions = ["Semua", "Baru", "Selesai"];

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-full sm:w-auto">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Kategori</label>
                <div className="flex flex-wrap gap-1.5 rounded-[1.25rem] border-2 border-slate-50 bg-slate-50/50 p-1.5 dark:border-white/5 dark:bg-white/5">
                    {subjekOptions.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilterSubjek(opt)}
                            className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${filterSubjek === opt
                                ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-black"
                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full sm:w-auto">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Status</label>
                <div className="flex gap-1.5 rounded-[1.25rem] border-2 border-slate-50 bg-slate-50/50 p-1.5 dark:border-white/5 dark:bg-white/5">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilterStatus(opt)}
                            className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${filterStatus === opt
                                ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-black"
                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
