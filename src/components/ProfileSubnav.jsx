"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const profileLinks = [
  { label: "Profil Instansi", href: "/profil" },
  { label: "Sejarah", href: "/profil/sejarah" },
  { label: "Visi & Misi", href: "/profil/visi-misi" },
  { label: "Tugas dan Fungsi", href: "/profil/tugas-fungsi" },
  { label: "Nilai Budaya Kerja", href: "/profil/nilai-budaya-kerja" },
  { label: "Tujuan", href: "/profil/tujuan" },
];

function isActive(pathname, href) {
  return pathname === href;
}

export default function ProfileSubnav() {
  const pathname = usePathname();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/85">
      <div className="flex flex-wrap gap-3">
        {profileLinks.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "inline-flex items-center rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
                  : "inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-400/40 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}