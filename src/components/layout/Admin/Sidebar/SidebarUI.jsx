import React from "react";
import Link from "next/link";
import AdminLogoutButton from "./AdminLogoutButton";

export function SidebarNavLink({ href, label, icon, active, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-2xl px-5 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all ${active
        ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10 dark:bg-white dark:text-black dark:shadow-white/5"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
        }`}
    >
      <span className={`transition-colors ${active ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-500"}`}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function SidebarProfile({ profile, role, permissionContext }) {
  const compactName = String(profile?.full_name || "").trim() || String(profile?.email || "").split("@")[0] || "Admin";

  return (
    <div className="border-t-2 border-slate-50 px-5 py-6 dark:border-white/5">
      <div className="rounded-[2rem] border-2 border-slate-50 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-white/5">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Otorisasi Sesi</p>

        <div className="mt-4 space-y-1">
          <p className="truncate text-sm font-black uppercase text-slate-900 dark:text-white leading-tight">{compactName}</p>
          <p className="truncate text-[10px] font-bold text-slate-400 dark:text-slate-500">{profile?.email || "-"}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-xl border-2 border-white bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white shadow-sm">
            {role || "-"}
          </span>
          {role === "editor" && (
            <span className={`rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border-2 ${permissionContext?.approved && permissionContext?.isActive ? "bg-emerald-500 border-emerald-500 text-white" : "bg-amber-500 border-amber-500 text-white"}`}>
              {permissionContext?.approved && permissionContext?.isActive ? "Aktif" : "Tertunda"}
            </span>
          )}
        </div>
      </div>
      <div className="mt-6"><AdminLogoutButton /></div>
    </div>
  );
}
