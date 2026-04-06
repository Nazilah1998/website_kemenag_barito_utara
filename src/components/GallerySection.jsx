import Link from "next/link";
import { galleryList } from "../data/gallery";

export default function GallerySection() {
  const featuredGallery = galleryList.slice(0, 3);

  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              Galeri Kegiatan
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
              Dokumentasi Kegiatan dan Aktivitas Instansi
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
              Dokumentasi visual kegiatan pelayanan, pembinaan, koordinasi, dan
              aktivitas kelembagaan Kemenag Barito Utara sebagai bagian dari
              keterbukaan informasi publik.
            </p>
          </div>

          <Link
            href="/galeri"
            className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 md:inline-flex"
          >
            Lihat Semua Galeri
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredGallery.map((item) => (
            <article
              key={item.slug}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition hover:border-emerald-200 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-500/40 dark:hover:bg-slate-900"
            >
              <div className="flex h-52 items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-white px-6 text-center dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
                <div>
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-slate-900 dark:text-emerald-400 dark:ring-slate-800">
                    {item.category}
                  </span>
                  <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Dokumentasi Kegiatan
                  </p>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.subtitle}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link
            href="/galeri"
            className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Lihat Semua Galeri
          </Link>
        </div>
      </div>
    </section>
  );
}