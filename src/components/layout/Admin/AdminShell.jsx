"use client";

import React from "react";
import { useAdminShell } from "@/hooks/useAdminShell";
import { useTheme } from "@/context/ThemeContext";
import AdminSidebar from "./Sidebar/AdminSidebar";
import AdminThemeToggle from "./Header/AdminThemeToggle";
import { MenuIcon, CloseIcon } from "./AdminShellUI";

export default function AdminShell({ children }) {
  const a = useAdminShell();
  const { isDark, toggleTheme } = useTheme();

  if (a.loading) return <AdminLoading />;

  // If we are not loading and not an admin/editor, 
  // just render the children (which might be the Login form)
  if (!a.role) {
    return <div className="admin-unauthenticated-root">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 lg:flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-72 lg:shrink-0">
        <div className="sticky top-0 h-screen border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <AdminSidebar profile={a.profile} role={a.role} permissionContext={a.permissionContext} />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar a={a} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b-2 border-slate-50 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/80">
          <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
            <div className="min-w-0 flex items-center gap-3">
              <button type="button" onClick={() => a.setSidebarOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-50 text-slate-700 transition hover:bg-white hover:text-slate-900 dark:border-white/5 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white lg:hidden">
                <MenuIcon />
              </button>
              <AdminBrand />
            </div>

            <div className="flex items-center gap-2">
              <AdminThemeToggle isDark={isDark} toggle={toggleTheme} />
              <AdminUserBadge name={a.compactName} email={a.profile?.email} />
            </div>
          </div>
        </header>

        <main className="min-w-0 px-4 py-5 sm:px-6 xl:px-8">{children}</main>
      </div>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="relative w-full max-w-[400px] rounded-[3rem] border-2 border-white bg-white/80 p-12 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-500 dark:border-white/5 dark:bg-slate-900/80">
        <div className="relative mx-auto mb-10 h-20 w-20">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 rounded-2xl border-4 border-slate-100 dark:border-white/5" />
          <div className="absolute inset-0 animate-spin rounded-2xl border-4 border-emerald-500 border-t-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)]" />

          {/* Internal Pulse Dot */}
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600 dark:text-emerald-400 italic">
            Authorization
          </p>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight leading-none">
            Memuat Panel Kendali
          </h2>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Kementerian Agama Barito Utara
          </p>
        </div>

        {/* Loading Progress Sim (Visual Only) */}
        <div className="mt-10 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
          <div className="h-full w-2/3 rounded-full bg-slate-900 dark:bg-white animate-[loading_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

function AdminBrand() {
  return (
    <div className="min-w-0 group cursor-default">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400 italic">Panel Kendali</p>
      </div>
      <h1 className="truncate text-xl font-black text-slate-900 dark:text-white uppercase italic leading-none tracking-tight">Kemenag Barito Utara</h1>
    </div>
  );
}

function AdminUserBadge({ name, email }) {
  return (
    <div className="hidden min-w-[180px] max-w-[240px] rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-4 py-2.5 dark:border-white/5 dark:bg-white/5 sm:block transition-all hover:border-slate-200 dark:hover:border-white/10">
      <p className="truncate text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white italic">{name}</p>
      <p className="truncate text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">{email || "-"}</p>
    </div>
  );
}

function MobileSidebar({ a }) {
  if (!a.sidebarOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <button
        type="button"
        onClick={() => a.setSidebarOpen(false)}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
      />
      <div className="relative flex h-full w-[85%] max-w-[320px] flex-col border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <AdminSidebar
          profile={a.profile}
          role={a.role}
          permissionContext={a.permissionContext}
          onNavigate={() => a.setSidebarOpen(false)}
          onClose={() => a.setSidebarOpen(false)}
        />
      </div>
    </div>
  );
}