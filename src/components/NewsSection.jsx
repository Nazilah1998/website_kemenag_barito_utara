import Link from "next/link";
import { getLatestBerita } from "../lib/berita";

export default async function NewsSection() {
  const latestNews = await getLatestBerita(3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            Berita Terbaru
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Informasi dan Kegiatan Terkini
          </h2>

          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Ikuti pembaruan kegiatan, layanan, dan publikasi resmi Kemenag
            Barito Utara.
          </p>
        </div>

        <Link
          href="/berita"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Lihat Semua Berita
        </Link>
      </div>

      {latestNews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-xl font-semibold text-slate-900">
            Belum ada berita terbaru
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Berita yang sudah dipublikasikan akan tampil otomatis di bagian ini.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestNews.map((item) => (
            <article
              key={item.id ?? item.slug}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                  {item.category || "Umum"}
                </span>
                <span>{item.date || "-"}</span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900 transition group-hover:text-emerald-700">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.excerpt || "Klik untuk membaca berita selengkapnya."}
              </p>

              <Link
                href={`/berita/${item.slug}`}
                className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Baca selengkapnya
                <span className="ml-1" aria-hidden="true">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}