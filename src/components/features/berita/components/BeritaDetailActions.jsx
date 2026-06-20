"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Share2, Link as LinkIcon, Check } from "lucide-react";



function buildAbsoluteUrl(path = "") {
    if (typeof window === "undefined") return path || "";
    if (/^https?:\/\//i.test(path || "")) return path;
    return new URL(path || window.location.pathname, window.location.origin).toString();
}

export default function BeritaDetailActions({ title, path }) {
    const { t, locale } = useLanguage();
    const [copied, setCopied] = useState(false);

    async function handleCopyLink() {
        try {
            const absoluteUrl = buildAbsoluteUrl(path);
            await navigator.clipboard.writeText(absoluteUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }

    async function handleShare() {
        const absoluteUrl = buildAbsoluteUrl(path);

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title,
                    url: absoluteUrl,
                });
                return;
            } catch {
                // user canceled share
            }
        }

        await handleCopyLink();
    }

    function handleWhatsAppShare() {
        const absoluteUrl = buildAbsoluteUrl(path);
        const text = encodeURIComponent(`${title} - ${absoluteUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    }

    return (
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t("newsDetail.quickAction")}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {t("newsDetail.actionDesc")}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                {/* Bagikan */}
                <button
                    onClick={handleShare}
                    className="flex flex-col items-center justify-center gap-1.5 h-16 w-full rounded-2xl border border-blue-200 bg-blue-50/50 px-1 transition hover:border-blue-300 hover:bg-blue-100 hover:shadow-sm dark:border-blue-900/50 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 active:scale-95"
                >
                    <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-300">Bagikan</span>
                </button>

                {/* WhatsApp */}
                <button
                    onClick={handleWhatsAppShare}
                    className="flex flex-col items-center justify-center gap-1.5 h-16 w-full rounded-2xl border border-emerald-200 bg-emerald-50/50 px-1 transition hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 active:scale-95"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-emerald-600 dark:text-emerald-400">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-300">WhatsApp</span>
                </button>

                {/* Salin Link */}
                <button
                    onClick={handleCopyLink}
                    className="flex flex-col items-center justify-center gap-1.5 h-16 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-1 transition hover:border-slate-300 hover:bg-slate-100 hover:shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 active:scale-95"
                >
                    {copied ? (
                        <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                        <LinkIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    )}
                    <span className={`text-[10px] sm:text-xs font-bold ${copied ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>
                        {copied ? (locale === "en" ? "Copied" : "Tersalin") : "Salin Link"}
                    </span>
                </button>
            </div>

            <p className="mt-4 break-all text-xs leading-5 text-slate-500 dark:text-slate-400">
                {path}
            </p>
        </div>
    );
}