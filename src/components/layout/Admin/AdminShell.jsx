"use client";

import React from "react";
import { useAdminShell } from "@/hooks/useAdminShell";
import { useTheme } from "@/context/ThemeContext";
import AdminSidebar from "./Sidebar/AdminSidebar";
import AdminUserMenu from "./Header/AdminUserMenu";
import { MenuIcon } from "./AdminShellUI";

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
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 lg:flex">
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
            </div>

            <div className="flex items-center gap-2">
              <AdminUserMenu profile={a.profile} role={a.role} compactName={a.compactName} isDark={isDark} toggleTheme={toggleTheme} />
            </div>
          </div>
        </header>

        <main className="min-w-0 px-4 py-5 sm:px-6 xl:px-8">{children}</main>
      </div>
    </div>
  );
}

function AdminLoading() {
  return null;
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