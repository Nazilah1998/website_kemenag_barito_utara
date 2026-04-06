import Link from "next/link";
import { serviceHighlights } from "../data/services";

export default function ServicesSection() {
  return (
    <section className="py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Layanan Publik
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
            Akses Informasi Layanan Utama
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
            Informasi layanan utama disusun untuk membantu masyarakat memahami
            jenis layanan yang tersedia di Kemenag Barito Utara.
          </p>
        </div>

        <Link
          href="/layanan"
          className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 md:inline-flex"
        >
          Lihat Semua Layanan
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {serviceHighlights.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40"
          >
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {item.category}
            </span>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              {item.description}
            </p>

            <div className="mt-5 inline-flex text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Buka informasi →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 md:hidden">
        <Link
          href="/layanan"
          className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Lihat Semua Layanan
        </Link>
      </div>
    </section>
  );
}