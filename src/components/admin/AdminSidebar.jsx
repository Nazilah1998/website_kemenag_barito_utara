"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/berita", label: "Berita", icon: "📰" },
  { href: "/admin/pengumuman", label: "Pengumuman", icon: "📢" },
  { href: "/admin/agenda", label: "Agenda", icon: "🗓️" },
  { href: "/admin/dokumen", label: "Dokumen", icon: "📁" },
];

function NavLinks({ pathname, onClose }) {
  return (
    <nav className="space-y-2">
      {menuItems.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active
              ? "bg-emerald-600 text-white shadow-md"
              : "text-slate-700 hover:bg-slate-100"
              }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-75 overflow-y-auto border-r border-slate-200 bg-white p-5 shadow-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:shrink-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex min-h-full flex-col">
          <div className="rounded-[28px] bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-600 p-5 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              Admin Panel
            </p>
            <h2 className="mt-2 text-2xl font-bold">Kemenag Barito Utara</h2>
            <p className="mt-3 text-sm leading-6 text-white/85">
              Kelola konten website publik dari satu panel yang lebih rapi dan fokus.
            </p>
          </div>

          <div className="mt-6 flex-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Navigasi
            </p>
            <NavLinks pathname={pathname} onClose={onClose} />
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Akses cepat</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Buka website publik untuk melihat hasil perubahan yang sudah tayang.
            </p>

            <Link
              href="/"
              onClick={onClose}
              className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Kembali ke website
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}