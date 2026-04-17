import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { laporanCategories } from "@/data/laporan";

export const metadata = {
  title: "Laporan dan Akuntabilitas",
  description:
    "Dokumen akuntabilitas Kementerian Agama Kabupaten Barito Utara: Renstra, Perjanjian Kinerja, Laporan Kinerja, dan SOP.",
};

export default function LaporanIndexPage() {
  return (
    <>
      <PageBanner
        title="Laporan dan Akuntabilitas"
        description="Transparansi dan akuntabilitas kinerja Kementerian Agama Kabupaten Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Laporan" },
        ]}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Dokumen Akuntabilitas
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Halaman ini menghimpun dokumen resmi yang mencerminkan
              perencanaan, pelaksanaan, dan evaluasi kinerja instansi.
              Setiap dokumen dapat diunduh atau dilihat pratinjaunya.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {laporanCategories.map((item) => (
              <Link
                key={item.slug}
                href={`/laporan/${item.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
              >
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Buka Dokumen →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
