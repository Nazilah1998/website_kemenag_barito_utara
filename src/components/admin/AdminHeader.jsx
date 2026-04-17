"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const titleMap = {
  "/admin": {
    title: "Dashboard",
    subtitle: "Ringkasan akun admin dan akses cepat ke modul publikasi.",
  },
  "/admin/berita": {
    title: "Kelola Berita",
    subtitle: "Workflow editorial berita, status tayang, dan kontrol konten publik.",
  },
  "/admin/dokumen": {
    title: "Kelola Dokumen",
    subtitle: "Pusat kontrol dokumen publik dan arsip unggahan.",
  },
};

function formatNow() {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function AdminHeader({ onOpenSidebar }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/admin/session", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!active) return;
        if (response.ok) {
          setUser(data?.user || null);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  const pageInfo = useMemo(() => {
    if (titleMap[pathname]) return titleMap[pathname];
    if (pathname.startsWith("/admin/berita")) return titleMap["/admin/berita"];
    if (pathname.startsWith("/admin/dokumen")) return titleMap["/admin/dokumen"];

    return {
      title: "Admin Panel",
      subtitle: "Kelola data dan konten website publik.",
    };
  }, [pathname]);

  const displayName = user?.full_name?.trim() || "Admin";
  const displayEmail = user?.email || "-";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label="Buka menu admin"
          >
            ☰
          </button>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Panel Admin
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold text-slate-900">
              {pageInfo.title}
            </h1>
            <p className="mt-1 truncate text-sm text-slate-500">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Tanggal
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatNow()}
            </p>
          </div>

          <div className="max-w-[320px] rounded-2xl border border-slate-200 bg-white px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Login sebagai
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900" title={displayName}>
              {displayName}
            </p>
            <p className="truncate text-xs text-emerald-700" title={displayEmail}>
              {displayEmail}
            </p>
          </div>

          <AdminLogoutButton />
        </div>
      </div>
    </header>
  );
}