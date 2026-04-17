import Link from "next/link";
import PageBanner from "./PageBanner";

function DocumentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

export default function DocumentListPage({
  title,
  description,
  breadcrumb = [],
  intro,
  documents = [],
  notice,
}) {
  const hasDocuments = Array.isArray(documents) && documents.length > 0;

  return (
    <>
      <PageBanner
        title={title}
        description={description}
        breadcrumb={breadcrumb}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          {intro ? (
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Ringkasan
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {typeof intro === "string" ? <p>{intro}</p> : intro}
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Daftar Dokumen
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Klik dokumen untuk mengunduh atau melihat pratinjau.
            </p>

            {hasDocuments ? (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {documents.map((doc, index) => {
                  const external = doc.href?.startsWith("http");
                  const linkProps = external
                    ? {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {};
                  return (
                    <li key={`${doc.title}-${index}`}>
                      <Link
                        href={doc.href || "#"}
                        {...linkProps}
                        className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
                      >
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          <DocumentIcon />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {doc.title}
                          </p>
                          {doc.meta ? (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {doc.meta}
                            </p>
                          ) : null}
                          {doc.description ? (
                            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                              {doc.description}
                            </p>
                          ) : null}
                        </div>
                        <span
                          aria-hidden="true"
                          className="text-slate-400 transition group-hover:text-emerald-600 dark:text-slate-500"
                        >
                          ↗
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
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

          {notice ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              {notice}
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
