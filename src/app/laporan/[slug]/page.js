import { notFound } from "next/navigation";
import DocumentListPage from "@/components/DocumentListPage";
import { laporanCategories, getLaporanBySlug } from "@/data/laporan";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { siteInfo } from "@/data/site";

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

  const url = `/laporan/${item.slug}`;

  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url,
      siteName: siteInfo.shortName,
      title: item.title,
      description: item.description,
    },
    twitter: {
      card: "summary",
      title: item.title,
      description: item.description,
    },
  };
}

export default async function LaporanDetailPage({ params }) {
  const { slug } = await params;
  const item = getLaporanBySlug(slug);

  if (!item) {
    notFound();
  }

  const jsonLd = breadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: "Laporan", url: "/laporan" },
    { name: item.title, url: `/laporan/${item.slug}` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
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
    </>
  );
}
