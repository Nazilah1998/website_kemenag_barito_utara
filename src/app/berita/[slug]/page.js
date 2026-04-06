import PageBanner from "../../../components/PageBanner";
import { beritaList } from "../../../data/berita";
import { notFound } from "next/navigation";
import Link from "next/link"; // <--- Tambahkan ini

export default function DetailBeritaPage({ params }) {
  const berita = beritaList.find((item) => item.slug === params.slug);
  if (!berita) notFound();

  return (
    <>
      <PageBanner
        title={berita.title}
        description={berita.excerpt}
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Berita", href: "/berita" },
          { label: berita.title },
        ]}
      />
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-6">
        <Link href="/berita"
          className="text-sm font-semibold text-emerald-700 hover:underline"
        >
          ← Kembali ke halaman berita
        </Link>
      </div>

      <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="h-72 bg-gradient-to-br from-emerald-200 via-emerald-100 to-slate-100 md:h-96" />

        <div className="p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            {berita.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            {berita.title}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Dipublikasikan pada {berita.date}
          </p>

          <p className="mt-6 text-base leading-8 text-slate-700">
            {berita.excerpt}
          </p>

          <div className="mt-8 space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm leading-8 text-slate-700 md:text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </main>
    </>
  );
}