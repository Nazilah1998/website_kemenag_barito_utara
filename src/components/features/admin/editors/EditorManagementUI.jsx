import React from "react";
import { Badge, FilterButton } from "./EditorUI";
import { SearchIcon } from "./EditorIcons";

export function EditorHeader({ pendingCount, filteredCount, totalCount, onAddEditor }) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Sistem Keamanan Pusat
          </p>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
          Manajemen Editor
        </h1>
        <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
          Kelola hak akses personil, verifikasi pengajuan akun baru, dan pantau status aktifasi secara tersentralisasi.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:items-end">
        <button
          onClick={onAddEditor}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Editor Baru
        </button>

        <div className="flex flex-wrap justify-end gap-3">
          <Badge tone="amber">Pending: {pendingCount}</Badge>
          <Badge tone="blue">Ditampilkan: {filteredCount}</Badge>
          <Badge tone="slate">Total Editor: {totalCount}</Badge>
        </div>
      </div>
    </div>
  );
}

export function EditorFilters({
  search,
  setSearch,
  filterRole,
  setFilterRole
}) {
  return (
    <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md group">
        <span className="absolute inset-y-0 left-0 flex items-center pl-6 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama, email, unit kerja, role..."
          className="h-14 w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium focus:border-slate-900 focus:bg-white focus:ring-8 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-white dark:focus:bg-slate-900 dark:focus:ring-white/5"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "admin", "editor"].map((role) => (
          <FilterButton
            key={role}
            active={filterRole === role}
            onClick={() => setFilterRole(role)}
          >
            {role === "all" ? "Semua Akun" : role.toUpperCase()}
          </FilterButton>
        ))}
      </div>
    </div>
  );
}
