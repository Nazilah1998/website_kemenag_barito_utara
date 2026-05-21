import PageBanner from "@/components/common/PageBanner";
import SearchResultsClient from "@/components/features/search/SearchResultsClient";

export const metadata = {
  title: "Pencarian",
  description: "Halaman pencarian website Kemenag Barito Utara",
};

export default async function PencarianPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";

  return (
    <>
      <PageBanner
        title="Pencarian"
        description="Temukan berita, layanan, dokumen publik, dan informasi penting lainnya."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Pencarian" }]}
      />
      <SearchResultsClient initialQuery={query} />
    </>
  );
}
