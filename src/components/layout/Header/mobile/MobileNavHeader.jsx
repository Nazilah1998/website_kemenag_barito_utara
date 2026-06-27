import React from "react";
import Image from "next/image";
import { CloseIcon } from "../HeaderIcons";
import { useSiteSettings } from "@/context/SettingsContext";

export function MobileNavHeader({ onClose }) {
  const { siteInfo } = useSiteSettings();
  
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-900">
      <div className="flex items-center gap-3">
        <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={36} height={36} className="w-9 h-9 object-contain" unoptimized />
        <div className="flex flex-col justify-center mt-0.5">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 dark:text-emerald-300/80 leading-none mb-0.5">
            {siteInfo.logoTitleLine1}
          </span>
          <span className="block text-sm font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300 leading-none">
            {siteInfo.logoTitleLine2.replace(/KABUPATEN\s+/i, "")}
          </span>
        </div>

      </div>
      <button onClick={onClose} className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        <CloseIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
