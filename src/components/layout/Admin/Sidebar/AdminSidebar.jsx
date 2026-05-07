"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { PERMISSIONS } from "@/lib/permissions";
import { SidebarNavLink, SidebarProfile } from "./SidebarUI";
import { DashboardIcon, NewsIcon, FolderIcon, SliderIcon, UsersIcon, AuditIcon, MailIcon } from "./SidebarIcons";

function hasAccess(context, permission) {
  if (!context) return false;
  if (context.isSuperAdmin) return true;
  return Array.isArray(context.permissions) ? context.permissions.includes(permission) : false;
}

export default function AdminSidebar({ profile, role, permissionContext, onNavigate, onClose }) {
  const pathname = usePathname();
  const ctx = permissionContext;

  const links = [
    { href: "/admin", label: "Dashboard", icon: <DashboardIcon />, active: pathname === "/admin", show: hasAccess(ctx, PERMISSIONS.DASHBOARD_VIEW) },
    { href: "/admin/berita", label: "Berita", icon: <NewsIcon />, active: pathname.startsWith("/admin/berita"), show: hasAccess(ctx, PERMISSIONS.BERITA_VIEW) },
    { href: "/admin/laporan", label: "Dokumen Laporan", icon: <FolderIcon />, active: pathname === "/admin/laporan" || pathname.startsWith("/admin/laporan/"), show: hasAccess(ctx, PERMISSIONS.LAPORAN_VIEW) },
    { href: "/admin/homepage-slides", label: "Slider Beranda", icon: <SliderIcon />, active: pathname.startsWith("/admin/homepage-slides"), show: hasAccess(ctx, PERMISSIONS.HOMEPAGE_SLIDES_VIEW) },
    { href: "/admin/pesan", label: "Pesan & Pengaduan", icon: <MailIcon />, active: pathname.startsWith("/admin/pesan"), show: hasAccess(ctx, PERMISSIONS.KONTAK_MANAGE) },
    { href: "/admin/audit", label: "Audit Log", icon: <AuditIcon />, active: pathname.startsWith("/admin/audit"), show: hasAccess(ctx, PERMISSIONS.AUDIT_VIEW) },
    { href: "/admin/editors", label: "Manajemen Editor", icon: <UsersIcon />, active: pathname.startsWith("/admin/editors"), show: role === "super_admin" },
  ];

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950">
      <SidebarHeader onClose={onClose} />
      <div className="flex-1 overflow-y-auto px-5 py-8 no-scrollbar">
        <p className="mb-5 px-5 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Menu Navigasi</p>
        <nav className="space-y-3 no-scrollbar">
          {links.filter(l => l.show).map(l => (
            <SidebarNavLink key={l.href} {...l} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>
      <SidebarProfile profile={profile} role={role} permissionContext={ctx} />
    </div>
  );
}

function SidebarHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-slate-50 px-6 py-6 dark:border-white/5">
      <div className="group cursor-default">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-1 w-1 rounded-full bg-emerald-500" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400">Admin CMS</p>
        </div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-none tracking-tight">Kemenag Barito Utara</h2>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-50 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 dark:border-white/5 dark:text-slate-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

