import AdminPesanManager from "@/components/features/admin/AdminPesanManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Pesan & Pengaduan | Admin Kemenag",
  description: "Manajemen kotak masuk pesan dan pengaduan Kemenag Barito Utara.",
};

export default function AdminPesanPage() {
  return <AdminPesanManager />;
}
