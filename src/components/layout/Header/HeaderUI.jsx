import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteInfo } from "@/data/site";
import { CloseIcon, HamburgerIcon } from "./HeaderIcons";

export function HeaderLogo() {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 p-2 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
        <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={40} height={40} className="h-auto w-10 object-contain" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300">{siteInfo.logoTitleLine1}</p>
        <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-500 dark:text-slate-400">{siteInfo.logoTitleLine2}</p>
      </div>

    </Link>
  );
}

export function MobileMenuToggle({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative z-[101] flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm transition active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:hidden"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Tutup menu" : "Buka menu"}
    >
      <span>Menu</span>
      {isOpen ? (
        <CloseIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <HamburgerIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      )}
    </button>
  );
}
