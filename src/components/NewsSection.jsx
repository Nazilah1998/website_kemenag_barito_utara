import Link from "next/link";
import { getLatestBerita } from "../lib/berita";

export default function NewsSection() {
  const latestNews = getLatestBerita(3);

  return (
    <section className="py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Berita Terbaru
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Informasi dan Kegiatan Terkini
          </h2>
        </div>

        <Link
          href="/berita"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Lihat Semua Berita
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {latestNews.map((item) => (
          <article
            key={item.slug}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-colors dark:bg-slate-900 dark:ring-slate-800"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {item.date} · {item.category}
            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">
              {item.title}
            </h3>

            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
              {item.excerpt}
            </p>

            <Link
              href={`/berita/${item.slug}`}
              className="mt-5 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Baca selengkapnya →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}