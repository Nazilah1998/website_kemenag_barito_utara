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
        <p className="text-sm font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300 leading-tight">
          <span className="block">{siteInfo.logoTitleLine1}</span>
          <span className="block">{siteInfo.logoTitleLine2}</span>
        </p>

      </div>
      <button onClick={onClose} className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        <CloseIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
