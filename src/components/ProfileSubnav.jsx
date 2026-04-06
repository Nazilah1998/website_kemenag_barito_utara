"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const profileLinks = [
  { label: "Profil Instansi", href: "/profil" },
  { label: "Visi & Misi", href: "/profil/visi-misi" },
  { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
  { label: "Profil Pimpinan", href: "/profil/pimpinan" },
];

function isActive(pathname, href) {
  return pathname === href;
}

export default function ProfileSubnav() {
  const pathname = usePathname();

  return (
    <section className="pb-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
          {profileLinks.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
                    : "inline-flex items-center justify-center rounded-2xl bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}