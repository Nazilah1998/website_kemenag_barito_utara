"use client";

import React from "react";
import MaintenancePage from "@/components/features/maintenance/MaintenancePage";
import { useLanguage } from "@/context/LanguageContext";
import PageBanner from "@/components/common/PageBanner";

const INFORMASI_MAP = {
  regulasi: "nav.regulasi",
  "profil-pejabat": "nav.pejabat",
  "struktur-organisasi": "nav.struktur",
  "dasar-hukum": "nav.dasarHukum",
};

export default function InformasiSlugClientPage({ slug, pageData }) {
  const { t } = useLanguage();

  const i18nKey = INFORMASI_MAP[slug];
  const menuTitle = i18nKey
    ? i18nKey.startsWith("nav.")
      ? t(i18nKey)
      : i18nKey
    : "Informasi Publik";

  if (pageData) {
    return (
      <main className="min-h-screen bg-slate-50 pb-20 dark:bg-[#050B14]">
        <PageBanner
          title={pageData.title || menuTitle}
          description={pageData.description || ""}
          breadcrumb={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.informasi") },
            { label: pageData.title || menuTitle },
          ]}
          eyebrow="Informasi Publik"
        />
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 mt-10">
          <div
            className="text-slate-700 dark:text-slate-300 leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-semibold [&_h1]:mt-8 [&_h2]:mt-6 [&_h3]:mt-4 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-emerald-700 [&_a]:underline [&_a]:hover:text-emerald-800 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </div>
      </main>
    );
  }

  return (
    <MaintenancePage
      title={`${menuTitle} Sedang Diperbarui`}
      menuName={menuTitle}
      description={`Konten dan dokumen resmi untuk ${menuTitle} sedang dalam proses verifikasi dan penataan ulang untuk memastikan akurasi informasi bagi masyarakat.`}
      breadcrumb={[
        { label: t("nav.home"), href: "/" },
        { label: t("nav.informasi") },
        { label: menuTitle },
      ]}
    />
  );
}
