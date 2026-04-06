import Link from "next/link";
import { publicDocuments } from "../data/documents";

export default function PublicDocumentsSection() {
  const highlightedDocuments = publicDocuments.slice(0, 4);

  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Dokumen Publik
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Dokumen dan Unduhan untuk Masyarakat
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
              Akses dokumen penting, panduan, formulir, dan informasi pelayanan
              publik secara lebih terstruktur dalam satu tempat.
            </p>
          </div>

          <Link
            href="/dokumen"
            className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-800 md:inline-flex"
          >
            Lihat Semua Dokumen
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {highlightedDocuments.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {item.category}
                </span>

                <span className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  {item.fileLabel}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>

              <div className="mt-5">
                {item.isAvailable ? (
                  <Link
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Unduh dokumen →
                  </Link>
                ) : (
                  <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                    Segera tersedia
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link
            href="/dokumen"
            className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Lihat Semua Dokumen
          </Link>
        </div>
      </div>
    </section>
  );
}