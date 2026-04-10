import PremiumMaintenancePage from "@/components/PremiumMaintenancePage";

export const metadata = {
  title: "Agenda | Kemenag Barito Utara",
  description:
    "Halaman agenda sedang dalam proses maintenance dan pembaruan layanan informasi.",
};

export default function AgendaPage() {
  return (
    <PremiumMaintenancePage
      title="Agenda Kegiatan"
      featureName="Fitur Agenda"
      description="Halaman agenda sedang dalam proses pengembangan agar informasi kegiatan dapat ditampilkan dengan lebih jelas, sederhana, modern, dan mudah diakses oleh masyarakat."
    />
  );
}
