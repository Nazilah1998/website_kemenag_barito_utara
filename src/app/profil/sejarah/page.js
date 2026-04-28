"use client";

import React from "react";
import PageBanner from "@/components/common/PageBanner";
import { useLanguage } from "@/context/LanguageContext";

const timeline = [
  {
    year: "Awal Perjalanan",
    title: "Penguatan Layanan Keagamaan",
    desc: "Kemenag Barito Utara hadir untuk memperkuat pelayanan urusan agama, pendidikan keagamaan, dan pembinaan masyarakat.",
  },
  {
    year: "Transformasi",
    title: "Pelayanan Publik Lebih Terarah",
    desc: "Pelayanan terus dikembangkan melalui tata kelola yang lebih tertib, responsif, dan berorientasi pada kebutuhan masyarakat.",
  },
  {
    year: "Masa Kini",
    title: "Digital, Terbuka, dan Profesional",
    desc: "Kemenag Barito Utara terus bergerak menuju pelayanan modern berbasis integritas, profesionalitas, dan keterbukaan informasi.",
  },
];

export default function SejarahPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      <PageBanner
        title={t("nav.sejarah")}
        description="Perjalanan Kementerian Agama Kabupaten Barito Utara dalam menghadirkan pelayanan keagamaan yang dekat, inklusif, dan bermanfaat bagi masyarakat."
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.profil") },
          { label: t("nav.sejarah") },
        ]}
      />

      <section className="relative w-full px-6 py-14 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
              Jejak Pengabdian
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-slate-100">
              Tumbuh Bersama Masyarakat Barito Utara
            </h2>

            <p className="mt-6 text-sm leading-8 text-slate-600 dark:text-slate-400">
              Kementerian Agama Kabupaten Barito Utara merupakan bagian dari
              penyelenggaraan pemerintahan di bidang agama yang memiliki peran
              strategis dalam membina kehidupan beragama, pendidikan keagamaan,
              pelayanan umat, dan penguatan kerukunan masyarakat.
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-400">
              Dalam perkembangannya, Kemenag Barito Utara terus memperkuat
              kualitas layanan melalui peningkatan kapasitas aparatur,
              pemanfaatan teknologi informasi, dan tata kelola yang semakin
              akuntabel.
            </p>
          </div>

          <div className="space-y-5">
            {timeline.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400">
                      {item.year}
                    </p>
                    <h3 className="mt-2 text-xl font-black text-slate-950 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
