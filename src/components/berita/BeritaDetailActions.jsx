"use client";

import { useState } from "react";

function ActionButton({ onClick, children, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
        >
            {children}
        </button>
    );
}

function buildAbsoluteUrl(path = "") {
    if (typeof window === "undefined") return path || "";
    if (/^https?:\/\//i.test(path || "")) return path;
    return new URL(path || window.location.pathname, window.location.origin).toString();
}

export default function BeritaDetailActions({ title, path }) {
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
                // user batal share, abaikan
            }
        }

        await handleCopyLink();
    }

    return (
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Aksi cepat artikel
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Gunakan tombol ini untuk membagikan artikel resmi atau menyalin tautannya.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
                <ActionButton onClick={handleShare}>Bagikan artikel</ActionButton>
                <ActionButton onClick={handleCopyLink}>
                    {copied ? "Tautan tersalin" : "Salin tautan"}
                </ActionButton>
            </div>

            <p className="mt-4 break-all text-xs leading-5 text-slate-500 dark:text-slate-400">
                {path}
            </p>
        </div>
    );
}