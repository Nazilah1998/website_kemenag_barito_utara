import PageBanner from "../../components/PageBanner";
import BeritaListClient from "../../components/BeritaListClient";
import { getAllBerita } from "../../lib/berita";

export const metadata = {
  title: "Berita | Kemenag Barito Utara",
  description: "Informasi dan kegiatan terbaru Kemenag Barito Utara",
};

export default function BeritaPage() {
  const beritaList = getAllBerita();

  return (
    <>
      <PageBanner
        title="Berita"
        description="Publikasi berita dan kegiatan terbaru disusun dengan tampilan yang lebih rapi, nyaman dibaca, dan mudah ditelusuri."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Berita" }]}
      />

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <BeritaListClient items={beritaList} />
      </main>
    </>
  );
}