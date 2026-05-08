"use client";

import React from "react";
import PageBanner from "@/components/common/PageBanner";
import { useLanguage } from "@/context/LanguageContext";

export default function BeritaDetailHeader({ title }) {
  const { t } = useLanguage();

  return (
    <PageBanner
      title={title}
      eyebrow={t("berita.publicService")}
      breadcrumb={[
        { label: t("nav.home"), href: "/" },
        { label: t("nav.berita"), href: "/berita" },
        { label: title },
      ]}
    />
  );
}
