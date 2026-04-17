import PremiumMaintenancePage from "@/components/PremiumMaintenancePage";

export const metadata = {
  title: "Area Perubahan ZI",
  description:
    "Rincian enam area perubahan Zona Integritas Kementerian Agama Kabupaten Barito Utara.",
};

export default function AreaPerubahanZIPage() {
  return (
    <PremiumMaintenancePage
      title="Area Perubahan ZI Sedang Diperbarui"
      featureName="Area Perubahan Zona Integritas"
      description="Rincian enam area perubahan, indikator capaian, dan bukti dukung sedang disusun agar mudah dibaca masyarakat."
    />
  );
}
