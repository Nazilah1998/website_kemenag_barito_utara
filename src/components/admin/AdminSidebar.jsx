"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { PERMISSIONS } from "@/lib/permissions";

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 13h6V4H4v9Z" />
      <path d="M14 20h6v-6h-6v6Z" />
      <path d="M14 10h6V4h-6v6Z" />
      <path d="M4 20h6v-3H4v3Z" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 5h14v14H5z" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 11l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4 6a2 2 0 012-2h12a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

function SliderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10" />
      <path d="M7 13h6" />
      <circle cx="17.5" cy="13" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M20 8v6" />
      <path d="M23 11h-6" />
    </svg>
  );
}

function NavLink({ href, label, icon, active, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active
        ? "bg-emerald-700 text-white shadow-sm"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
    >
      <span className={active ? "text-white" : "text-slate-500 dark:text-slate-400"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function hasAccess(permissionContext, permission) {
  if (!permissionContext) return false;
  if (permissionContext.isSuperAdmin) return true;
  return Array.isArray(permissionContext.permissions)
    ? permissionContext.permissions.includes(permission)
    : false;
}

export default function AdminSidebar({
  profile,
  role,
  permissionContext,
  onNavigate,
}) {
  const pathname = usePathname();

  const compactName =
    String(profile?.full_name || "").trim() ||
    String(profile?.email || "").split("@")[0] ||
    "Admin";

  const canViewDashboard = hasAccess(
    permissionContext,
    PERMISSIONS.DASHBOARD_VIEW
  );
  const canViewBerita = hasAccess(permissionContext, PERMISSIONS.BERITA_VIEW);
  const canViewLaporan = hasAccess(permissionContext, PERMISSIONS.LAPORAN_VIEW);
  const canViewHomepageSlides = hasAccess(
    permissionContext,
    PERMISSIONS.HOMEPAGE_SLIDES_VIEW
  );
  const canViewAudit = hasAccess(permissionContext, PERMISSIONS.AUDIT_VIEW);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900">
      <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
          Admin CMS
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          Kemenag Barito Utara
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Kelola konten website publik dengan panel yang ringkas dan fokus.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div>
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            Navigasi
          </p>

          <div className="space-y-2">
            {canViewDashboard ? (
              <NavLink
                href="/admin"
                label="Dashboard"
                icon={<DashboardIcon />}
                active={pathname === "/admin"}
                onNavigate={onNavigate}
              />
            ) : null}

            {canViewBerita ? (
              <NavLink
                href="/admin/berita"
                label="Berita"
                icon={<NewsIcon />}
                active={pathname.startsWith("/admin/berita")}
                onNavigate={onNavigate}
              />
            ) : null}

            {canViewLaporan ? (
              <NavLink
                href="/admin/laporan"
                label="Dokumen Laporan"
                icon={<FolderIcon />}
                active={
                  pathname === "/admin/laporan" ||
                  pathname.startsWith("/admin/laporan/")
                }
                onNavigate={onNavigate}
              />
            ) : null}

            {canViewHomepageSlides ? (
              <NavLink
                href="/admin/homepage-slides"
                label="Slider Beranda"
                icon={<SliderIcon />}
                active={pathname.startsWith("/admin/homepage-slides")}
                onNavigate={onNavigate}
              />
            ) : null}

            {canViewAudit ? (
              <NavLink
                href="/admin/audit"
                label="Audit Log"
                icon={<AuditIcon />}
                active={pathname.startsWith("/admin/audit")}
                onNavigate={onNavigate}
              />
            ) : null}

            {role === "super_admin" ? (
              <NavLink
                href="/admin/editors"
                label="Manajemen Editor"
                icon={<UsersIcon />}
                active={pathname.startsWith("/admin/editors")}
                onNavigate={onNavigate}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            Login sebagai
          </p>
          <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-900 dark:text-slate-100">
            {compactName}
          </p>
          <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
            {profile?.email || "-"}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:ring-slate-600">
              Role: {role || "-"}
            </span>

            {role === "editor" ? (
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${permissionContext?.approved && permissionContext?.isActive
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-700"
                  : "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700"
                  }`}
              >
                {permissionContext?.approved && permissionContext?.isActive
                  ? "Editor aktif"
                  : "Menunggu verifikasi"}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <AdminLogoutButton />
        </div>
      </div>
    </div>
  );
}
