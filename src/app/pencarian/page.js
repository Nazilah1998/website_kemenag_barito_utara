import PageBanner from "../../components/PageBanner";
import SearchResultsClient from "../../components/SearchResultsClient";

export const metadata = {
  title: "Pencarian | Kemenag Barito Utara",
  description: "Halaman pencarian website Kemenag Barito Utara",
};

<<<<<<< HEAD
export default function PencarianPage() {
=======
export default async function PencarianPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";

>>>>>>> 709cd12 (tolong perbaiki dong)
  return (
    <>
      <PageBanner
        title="Pencarian"
<<<<<<< HEAD
        description="Temukan berita, layanan, dokumen, agenda, dan profil dengan cepat."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Pencarian" },
        ]}
      />
      <SearchResultsClient />
=======
        description="Temukan berita, layanan, dokumen publik, dan informasi penting lainnya."
      />
      <SearchResultsClient initialQuery={query} />
>>>>>>> 709cd12 (tolong perbaiki dong)
    </>
  );
}