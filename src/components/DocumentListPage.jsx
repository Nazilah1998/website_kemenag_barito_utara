import Link from "next/link";
import PageBanner from "./PageBanner";
import PublicDocumentBrowser from "./laporan/PublicDocumentBrowser";

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export default function DocumentListPage({
  title,
  description,
  breadcrumb = [],
  intro,
  documents = [],
  stats = [],
}) {
  const hasDocuments = Array.isArray(documents) && documents.length > 0;

  return (
    <>
      <PageBanner
        title={title}
        description={description}
        breadcrumb={breadcrumb}
        eyebrow="Laporan dan Akuntabilitas"
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="w-full px-6 py-10 sm:px-10 md:py-14 lg:px-16 xl:px-20">
          {intro ? (
            <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Ringkasan
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {typeof intro === "string" ? <p>{intro}</p> : intro}
              </div>
            </div>
          ) : null}

          {Array.isArray(stats) && stats.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {stats.map((item, index) => (
                <StatCard
                  key={`${item.label}-${index}`}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          ) : null}

          <div className="mt-8">
            {hasDocuments ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <PublicDocumentBrowser documents={documents} />
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Dokumen belum dipublikasikan. Silakan kembali lagi nanti atau
                  hubungi kami untuk informasi lebih lanjut.
                </p>
                <Link
                  href="/kontak"
                  className="mt-4 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Hubungi Kami
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}