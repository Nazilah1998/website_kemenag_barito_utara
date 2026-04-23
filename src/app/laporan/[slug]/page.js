// src/app/laporan/[slug]/page.js

import { notFound } from "next/navigation";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import {
  getAllLaporanCategories,
  getLaporanCategoryBySlug,
} from "@/lib/laporan";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getAllLaporanCategories();

  return categories.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getLaporanCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Kategori Tidak Ditemukan | Laporan",
      description: "Kategori laporan yang Anda cari tidak tersedia.",
    };
  }

  return {
    title: `${category.title} | Laporan dan Akuntabilitas`,
    description:
      category.description ||
      `Daftar dokumen ${category.title} Kementerian Agama Kabupaten Barito Utara.`,
  };
}

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function FileIcon() {
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
      <path d="M14 2v6h6" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
      <path d="M9 9h1" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default async function LaporanCategoryPage({ params }) {
  const { slug } = await params;
  const category = await getLaporanCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const documents = Array.isArray(category.documents) ? category.documents : [];

  return (
    <>
      <PageBanner
        title={category.title}
        description={
          category.description ||
          "Daftar dokumen laporan resmi yang dapat diakses publik."
        }
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Laporan", href: "/laporan" },
          { label: category.title },
        ]}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="w-full px-6 py-10 sm:px-10 md:py-14 lg:px-16 xl:px-20">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/laporan"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
            >
              <ArrowLeftIcon />
              <span>Kembali ke semua kategori</span>
            </Link>

            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-300">
              {documents.length} dokumen tersedia
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_42%)]" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {category.title}
              </h2>

              {category.description ? (
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {category.description}
                </p>
              ) : null}
            </div>
          </div>

          {category.intro ? (
            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                {category.intro}
              </p>
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <article
                  key={doc.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_42%)]" />
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          <FileIcon />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                            Dokumen {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                            {doc.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {doc.description ? (
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {doc.description}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {doc.year ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          Tahun {doc.year}
                        </span>
                      ) : null}

                      {doc.file_size > 0 ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {doc.meta}
                        </span>
                      ) : null}

                      {typeof doc.view_count === "number" &&
                      doc.view_count > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <EyeIcon />
                          {doc.view_count.toLocaleString("id-ID")} kali dilihat
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5">
                      <a
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                      >
                        <DownloadIcon />
                        <span>Lihat Dokumen</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center lg:col-span-2 dark:border-slate-700 dark:bg-slate-900">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <FileIcon />
                </span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Belum ada dokumen pada kategori ini.
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Dokumen akan ditampilkan setelah dipublikasikan oleh admin.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
