import { notFound } from "next/navigation";
import DocumentListPage from "@/components/DocumentListPage";
import { laporanCategories, getLaporanBySlug } from "@/data/laporan";

export function generateStaticParams() {
  return laporanCategories.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getLaporanBySlug(slug);

  if (!item) {
    return {
      title: "Dokumen Tidak Ditemukan",
    };
  }

  return {
    title: item.title,
    description: item.description,
  };
}

export default async function LaporanDetailPage({ params }) {
  const { slug } = await params;
  const item = getLaporanBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <DocumentListPage
      title={item.title}
      description={item.description}
      intro={item.intro}
      documents={item.documents}
      breadcrumb={[
        { label: "Beranda", href: "/" },
        { label: "Laporan", href: "/laporan" },
        { label: item.title },
      ]}
      notice="Dokumen akan diperbarui secara berkala. Silakan hubungi PPID untuk informasi terkini."
    />
  );
}
