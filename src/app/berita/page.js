import PageBanner from "../../components/PageBanner";
import BeritaListClient from "../../components/BeritaListClient";
import { getAllBerita } from "../../lib/berita";

export const metadata = {
  title: "Berita | Kemenag Barito Utara",
  description: "Informasi dan kegiatan terbaru Kemenag Barito Utara",
};

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const beritaList = await getAllBerita();

  return (
    <>
      <PageBanner
        title="Berita"
        description="Informasi, publikasi, dan kegiatan terbaru Kemenag Barito Utara."
      />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <BeritaListClient items={beritaList} />
      </section>
    </>
  );
}