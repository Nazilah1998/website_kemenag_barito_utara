"use client";

import React from "react";
import { useParams } from "next/navigation";
import MaintenancePage from "@/components/features/maintenance/MaintenancePage";
import { useLanguage } from "@/context/LanguageContext";

import { getSeksiBySlug } from "@/data/seksi";
import SeksiDetailUI from "@/components/features/layanan/SeksiDetailUI";

const LAYANAN_MAP = {
  sekjen: "nav.sekjen",
  "seksi-bimas-islam": "nav.bimasIslam",
  "seksi-pendidikan-agama-islam": "nav.pai",
  "seksi-pendidikan-diniyah-dan-pondok-pesantren": "nav.pdpontren",
  "seksi-pendidikan-madrasah": "nav.penmad",
  "penyelenggara-hindu": "nav.hindu",
  "penyelenggara-zakat-wakaf": "nav.zakat",
  "kua-kantor-urusan-agama": "nav.kua",
  "agen-perubahan": "Agen Perubahan",
  "maklumat-pelayanan": "Maklumat Pelayanan",
  pengaduan: "Pengaduan Masyarakat",
};

export default function LayananSubPage() {
  const { slug } = useParams();
  const { t } = useLanguage();

  const i18nKey = LAYANAN_MAP[slug];
  const menuTitle = i18nKey
    ? i18nKey.startsWith("nav.")
      ? t(i18nKey)
      : i18nKey
    : "Layanan Publik";

  const breadcrumb = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.layanan") },
    { label: menuTitle },
  ];

  const seksiData = getSeksiBySlug(slug);

  if (seksiData) {
    return <SeksiDetailUI data={seksiData} breadcrumb={breadcrumb} menuTitle={menuTitle} />;
  }

  return (
    <MaintenancePage
      title={`${menuTitle} Sedang Disiapkan`}
      menuName={menuTitle}
      description={`Informasi mengenai ${menuTitle} di Kementerian Agama Kabupaten Barito Utara sedang dalam proses penataan ulang agar dapat ditampilkan dengan lebih rapi, modern, dan nyaman diakses.`}
      breadcrumb={breadcrumb}
    />
  );
}
