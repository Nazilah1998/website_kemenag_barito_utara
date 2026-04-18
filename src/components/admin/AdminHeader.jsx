"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { useTheme } from "@/context/ThemeContext";

const titleMap = {
  "/admin": {
    title: "Dashboard",
    subtitle: "Ringkasan akun admin dan akses cepat ke seluruh modul.",
  },
  "/admin/berita": {
    title: "Kelola Berita",
    subtitle: "Workflow editorial, status tayang, dan kontrol publikasi berita.",
  },
  "/admin/laporan": {
    title: "Dokumen Laporan",
    subtitle: "Kelola kategori, upload, edit, dan publikasi dokumen laporan.",
  },
  "/admin/halaman": {
    title: "Halaman Statis",
    subtitle: "Kelola konten halaman statis website instansi.",
  },
  "/admin/audit": {
    title: "Audit Log",
    subtitle: "Pantau jejak aktivitas dan perubahan data admin.",
  },
};

function formatNow() {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      title={theme === "dark" ? "Mode terang" : "Mode gelap"}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
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
        if (active) setUser(null);
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
    if (pathname.startsWith("/admin/laporan")) return titleMap["/admin/laporan"];
    if (pathname.startsWith("/admin/halaman")) return titleMap["/admin/halaman"];
    if (pathname.startsWith("/admin/audit")) return titleMap["/admin/audit"];

    return {
      title: "Admin Panel",
      subtitle: "Kelola data dan konten website publik.",
    };
  }, [pathname]);

  const displayName = user?.full_name?.trim() || "Admin";
  const displayEmail = user?.email || "-";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Buka menu admin"
          >
            ☰
          </button>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-400">
              Panel Admin
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold text-slate-900 dark:text-slate-100">
              {pageInfo.title}
            </h1>
            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Tanggal
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {formatNow()}
            </p>
          </div>

          <div className="max-w-[320px] rounded-2xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Login sebagai
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100" title={displayName}>
              {displayName}
            </p>
            <p className="truncate text-xs text-emerald-700 dark:text-emerald-400" title={displayEmail}>
              {displayEmail}
            </p>
          </div>

          <ThemeToggleButton />
          <AdminLogoutButton />
        </div>
      </div>
    </header>
  );
}