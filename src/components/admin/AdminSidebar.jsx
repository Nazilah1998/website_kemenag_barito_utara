"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

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

function NavLink({ href, label, icon, active, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active
        ? "bg-emerald-700 text-white shadow-sm"
        : "text-slate-700 hover:bg-slate-100"
        }`}
    >
      <span className={active ? "text-white" : "text-slate-500"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function AdminSidebar({ profile, onNavigate }) {
  const pathname = usePathname();

  const compactName =
    String(profile?.full_name || "").trim() ||
    String(profile?.email || "").split("@")[0] ||
    "Admin";

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
          Admin CMS
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Kemenag Barito Utara
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Kelola konten website publik dengan panel yang ringkas dan fokus.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div>
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
            Navigasi
          </p>

          <div className="space-y-2">
            <NavLink
              href="/admin"
              label="Dashboard"
              icon={<DashboardIcon />}
              active={pathname === "/admin"}
              onNavigate={onNavigate}
            />

            <NavLink
              href="/admin/berita"
              label="Berita"
              icon={<NewsIcon />}
              active={pathname.startsWith("/admin/berita")}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Login sebagai
          </p>
          <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-900">
            {compactName}
          </p>
          <p className="mt-1 break-all text-xs text-slate-500">
            {profile?.email || "-"}
          </p>
        </div>

        <div className="mt-4">
          <AdminLogoutButton />
        </div>
      </div>
    </div>
  );
}