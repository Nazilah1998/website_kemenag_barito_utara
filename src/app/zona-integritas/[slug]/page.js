"use client";

import React from "react";
import { useParams } from "next/navigation";
import PremiumMaintenancePage from "@/components/features/maintenance/PremiumMaintenancePage";
import { useLanguage } from "@/context/LanguageContext";

const ZI_MAP = {
  "area-perubahan-zi": "nav.ziArea",
  "video-pembangunan-zi": "nav.ziVideo",
  "berita-zona-integritas": "nav.ziBerita",
};

export default function ZIZoneSubPage() {
  const { slug } = useParams();
  const { t } = useLanguage();

  const i18nKey = ZI_MAP[slug];
  const menuTitle = i18nKey ? t(i18nKey) : "Zona Integritas";

  return (
    <PremiumMaintenancePage
      title={`${menuTitle} Sedang Disiapkan`}
      featureName={menuTitle}
      description={`Informasi mengenai ${menuTitle} dalam rangka pembangunan Zona Integritas (ZI) di Kementerian Agama Kabupaten Barito Utara sedang kami rapikan agar dapat ditampilkan secara kronologis dan transparan.`}
      breadcrumb={[
        { label: t("nav.home"), href: "/" },
        { label: t("nav.zi") },
        { label: menuTitle },
      ]}
    />
  );
}
