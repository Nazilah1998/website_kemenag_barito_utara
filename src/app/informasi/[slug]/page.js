"use client";

import React from "react";
import { useParams } from "next/navigation";
import MaintenancePage from "@/components/features/maintenance/MaintenancePage";
import { useLanguage } from "@/context/LanguageContext";

const INFORMASI_MAP = {
  regulasi: "nav.regulasi",
  "profil-pejabat": "nav.pejabat",
  "struktur-organisasi": "nav.struktur",
  "dasar-hukum": "nav.dasarHukum",
};

export default function InformasiSubPage() {
  const { slug } = useParams();
  const { t } = useLanguage();

  const i18nKey = INFORMASI_MAP[slug];
  const menuTitle = i18nKey
    ? i18nKey.startsWith("nav.")
      ? t(i18nKey)
      : i18nKey
    : "Informasi Publik";

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
