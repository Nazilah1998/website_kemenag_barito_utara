import PremiumMaintenancePage from "@/components/PremiumMaintenancePage";

export const metadata = {
  title: "Dokumen Publik | Kemenag Barito Utara",
  description:
    "Halaman dokumen publik sedang dalam proses maintenance dan pembaruan sistem.",
};

export default function DokumenPage() {
  return (
    <PremiumMaintenancePage
      title="Dokumen Publik"
      featureName="Fitur Dokumen Publik"
      description="Halaman dokumen publik sedang dalam proses pengembangan agar penyajian dokumen menjadi lebih tertata, lebih jelas, dan lebih nyaman digunakan."
    />
  );
}
