"use client";

import React from "react";
import Link from "next/link";
import PageBanner from "@/components/common/PageBanner";
import { useLanguage } from "@/context/LanguageContext";

const DEFAULT_SUB_PAGES = [
  {
    slug: "regulasi",
    title: "Regulasi",
    description:
      "Kumpulan peraturan dan regulasi terkait pelayanan keagamaan, pendidikan, dan tata kelola kelembagaan di lingkungan Kemenag Barito Utara.",
  },
  {
    slug: "profil-pejabat",
    title: "Profil Pejabat",
    description:
      "Informasi mengenai para pejabat struktural yang mengabdi di Kantor Kementerian Agama Kabupaten Barito Utara.",
  },
  {
    slug: "struktur-organisasi",
    title: "Struktur Organisasi",
    description:
      "Bagan hierarki kepemimpinan dan struktur organisasi Kantor Kementerian Agama Kabupaten Barito Utara.",
  },
  {
    slug: "dasar-hukum",
    title: "Dasar Hukum",
    description:
      "Landasan hukum dan peraturan perundang-undangan yang menjadi dasar pelaksanaan tugas dan fungsi Kementerian Agama.",
  },
];

function InfoCard({ slug, title, description, updatedAt }) {
  return (
    <Link
      href={`/informasi/${slug}`}
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-800"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
        </div>
        <svg className="h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function InformasiIndexClient({ staticPages = [] }) {
  const { t } = useLanguage();

  const dbPageLookup = {};
  for (const p of staticPages) {
    dbPageLookup[p.slug] = p;
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20 dark:bg-[#050B14]">
      <PageBanner
        title={t("nav.informasi")}
        description="Informasi publik, regulasi, profil pejabat, struktur organisasi, dan dasar hukum di lingkungan Kantor Kementerian Agama Kabupaten Barito Utara."
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.informasi") },
        ]}
        eyebrow="Informasi Publik"
      />

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 mt-10">
        <div className="grid gap-5 md:grid-cols-2">
          {DEFAULT_SUB_PAGES.map((sub) => {
            const db = dbPageLookup[sub.slug];
            return (
              <InfoCard
                key={sub.slug}
                slug={sub.slug}
                title={db?.title || sub.title}
                description={db?.description || sub.description}
                updatedAt={db?.updated_at}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
