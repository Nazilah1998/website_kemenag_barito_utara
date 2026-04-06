import PageBanner from "../../components/PageBanner";
import { publicDocuments } from "../../data/documents";

export const metadata = {
  title: "Dokumen Publik | Kemenag Barito Utara",
  description: "Dokumen, formulir, panduan, dan unduhan publik",
};

export default function DokumenPage() {
  return (
    <>
      <PageBanner
        title="Dokumen Publik"
        description="Panduan, formulir, standar pelayanan, dan dokumen informasi publik lainnya."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Dokumen Publik" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {publicDocuments.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {item.category}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  {item.fileLabel}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {item.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {item.description}
              </p>

              <div className="mt-5">
                {item.isAvailable ? (
                  <a
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Unduh dokumen →
                  </a>
                ) : (
                  <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                    Segera tersedia
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}