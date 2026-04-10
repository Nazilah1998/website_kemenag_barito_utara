"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const profileLinks = [
  { label: "Profil Instansi", href: "/profil" },
  { label: "Visi & Misi", href: "/profil/visi-misi" },
  { label: "5 Nilai Budaya Kerja", href: "/profil/nilai-budaya-kerja" },
  { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
  { label: "Sejarah Singkat Kabupaten", href: "/profil/sejarah-singkat-kabupaten" },
  { label: "Profil Kepala Kantor", href: "/profil/pimpinan" },
];

function isActive(pathname, href) {
  return pathname === href;
}

export default function ProfileSubnav() {
  const pathname = usePathname();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
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
                  : "inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
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