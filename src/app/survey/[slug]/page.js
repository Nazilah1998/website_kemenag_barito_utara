"use client";

import React from "react";
import { useParams } from "next/navigation";
import PremiumMaintenancePage from "@/components/features/maintenance/PremiumMaintenancePage";

const SURVEY_MAP = {
  "skm": "Survey Kepuasan Masyarakat (SKM)",
  "spak": "Survey Persepsi Anti Korupsi (SPAK)",
  "ptsp": "Survey Pelayanan PTSP",
};

export default function SurveySubPage() {
  const { slug } = useParams();

  const menuTitle = SURVEY_MAP[slug] || "Layanan Survey";

  return (
    <PremiumMaintenancePage
      title={`${menuTitle} Sedang Disiapkan`}
      featureName={menuTitle}
      description={`Sistem untuk ${menuTitle} di Kementerian Agama Kabupaten Barito Utara sedang kami siapkan agar dapat memberikan pengalaman pengisian survey yang lebih mudah, aman, dan terstruktur.`}
      breadcrumb={[
        { label: "Beranda", href: "/" },
        { label: "Survey", href: "/survey" },
        { label: menuTitle },
      ]}
    />
  );
}
