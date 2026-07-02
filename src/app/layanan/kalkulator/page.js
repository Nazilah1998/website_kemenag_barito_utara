import React from "react";
import PageBanner from "@/components/common/PageBanner";
import ZakatWarisCalculator from "@/components/features/layanan/ZakatWarisCalculator";
import { siteInfo } from "@/data/site";

export const metadata = {
  title: "Kalkulator Zakat & Waris",
  description: "Simulasi perhitungan Zakat Profesi, Zakat Maal, dan simulasi pembagian hak Waris Islam (Faraid) dasar secara mandiri.",
  alternates: {
    canonical: siteInfo.siteUrl.replace(/\/$/, "") + "/layanan/kalkulator",
  },
};

export default function KalkulatorPage() {
  return (
    <main className="theme-page min-h-screen">
      <PageBanner
        title="Kalkulator Zakat & Waris"
        subtitle="Layanan Masyarakat"
        description="Simulasi perhitungan Zakat Profesi, Zakat Maal, dan simulasi pembagian hak Waris Islam (Faraid) dasar secara mandiri."
        image="/assets/images/headers/information.jpg"
      />

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-12 md:py-20">
        <ZakatWarisCalculator />
      </div>
    </main>
  );
}
