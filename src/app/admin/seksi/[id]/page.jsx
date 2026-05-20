import AdminSeksiDetailManager from "@/components/features/admin/AdminSeksiDetailManager";

export const metadata = {
  title: "Kelola Kepegawaian & Seksi",
};

export default async function AdminSeksiDetailPage({ params }) {
  const { id } = await params;
  return <AdminSeksiDetailManager id={id} />;
}
