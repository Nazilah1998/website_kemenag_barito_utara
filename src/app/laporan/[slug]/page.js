// src/app/laporan/[slug]/page.js

import { notFound } from "next/navigation";
import Link from "next/link";
import PageBanner from "@/components/common/PageBanner";
import LaporanDocumentsClient from "@/components/features/laporan/LaporanDocumentsClient";
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

      <main className="relative bg-white dark:bg-slate-950">
        {/* Background Decorative Elements */}
        <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-full overflow-hidden opacity-40">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-100/50 blur-[120px] dark:bg-emerald-900/10" />
        </div>

        <section className="relative z-10 w-full px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
            <Link
              href="/laporan"
              className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[11px] font-bold text-slate-500 shadow-sm transition-all hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-700"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-50 transition-all group-hover:bg-emerald-50 dark:bg-white/5 dark:group-hover:bg-emerald-900/30">
                <ArrowLeftIcon />
              </div>
              <span>Back to Index</span>
            </Link>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 dark:bg-emerald-900/10">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                {documents.length} Dokumen Tersedia
              </span>
            </div>
          </div>

          {/* Modern Minimalist Header Banner */}
          <div className="relative mb-14 overflow-hidden rounded-[2.5rem] bg-emerald-950 p-8 text-white shadow-xl lg:p-12">
            {/* Subtle Decorative Mesh */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.3),_transparent_70%)]" />
            </div>

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                  Category Repository
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {category.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-emerald-100/60">
                  {category.description
                    ? category.description.split(".")[0] + "."
                    : "Koleksi dokumen resmi untuk transparansi publik."}
                </p>
              </div>

              {category.intro && (
                <div className="hidden shrink-0 rounded-3xl bg-white/5 p-6 backdrop-blur-sm border border-white/10 max-w-xs lg:block">
                  <p className="text-[10px] italic leading-relaxed text-emerald-100/40">
                    &ldquo;{category.intro.substring(0, 80)}...&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <LaporanDocumentsClient documents={documents} />
          </div>
        </section>
      </main>
    </>
  );
}
