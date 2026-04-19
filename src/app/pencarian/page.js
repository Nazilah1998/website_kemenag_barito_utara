import PageBanner from "../../components/PageBanner";
import SearchResultsClient from "../../components/SearchResultsClient";

export const metadata = {
  title: "Pencarian | Kemenag Barito Utara",
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
