"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function BeritaViewsBadge({ views = 0, className = "", isSmall = false }) {
    const { t, locale } = useLanguage();

    return (
        <div
            className={`inline-flex items-center gap-1.5 ${isSmall ? "text-[9px]" : "text-[11px]"} text-slate-400 dark:text-slate-500 ${className}`.trim()}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={isSmall ? "12" : "14"}
                height={isSmall ? "12" : "14"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
            </svg>

            <span className="font-medium">
                {Number(views || 0).toLocaleString(locale === "en" ? "en-US" : "id-ID")} {t("berita.views")}
            </span>
        </div>
    );
}