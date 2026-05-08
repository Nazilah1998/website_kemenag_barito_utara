"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function BeritaViewCounter({ slug, initialViews = 0 }) {
  const { t, locale } = useLanguage();
  const [views, setViews] = useState(Number(initialViews || 0));

  useEffect(() => {
    if (!slug) return;

    const storageKey = `berita-viewed:${slug}`;
    const alreadyViewed = sessionStorage.getItem(storageKey);

    if (alreadyViewed) {
      return;
    }

    async function incrementViews() {
      try {
        const response = await fetch(`/api/berita/${slug}/view`, {
          method: "POST",
        });

        const data = await response.json();

        if (response.ok) {
          setViews(Number(data?.views || 0));
          sessionStorage.setItem(storageKey, "1");
        }
      } catch {
        // diamkan saja, jangan ganggu halaman
      }
    }

    incrementViews();
  }, [slug]);

  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>{views.toLocaleString(locale === "en" ? "en-US" : "id-ID")} {t("berita.readCount")}</span>
    </div>
  );
}