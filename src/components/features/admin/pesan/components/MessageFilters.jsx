import React from "react";

export default function MessageFilters({
    searchQuery,
    setSearchQuery,
    filterSubjek,
    setFilterSubjek,
    filterStatus,
    setFilterStatus
}) {
    const subjekOptions = ["Semua", "Pertanyaan", "Masukan", "Pengaduan"];
    const statusOptions = ["Semua", "Baru", "Selesai"];

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-wrap">
            {/* Search */}
            <div className="w-full sm:w-56">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block">Cari</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Nama, subjek, atau pesan..."
                        className="h-10 w-full rounded-xl border-2 border-slate-50 bg-slate-50/50 pl-9 pr-3 text-[10px] font-bold text-slate-900 outline-none transition-all focus:border-slate-900 focus:bg-white dark:border-white/5 dark:bg-white/5 dark:text-white dark:focus:border-white dark:focus:bg-transparent"
                    />
                </div>
            </div>

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
