"use client";

import React from "react";
import PageBanner from "@/components/common/PageBanner";
import { useLanguage } from "@/context/LanguageContext";

const goals = [
  {
    title: "Meningkatkan Kualitas Layanan",
    desc: "Menghadirkan pelayanan keagamaan yang mudah, cepat, transparan, dan responsif terhadap kebutuhan masyarakat.",
  },
  {
    title: "Memperkuat Kerukunan Umat",
    desc: "Membangun kehidupan beragama yang damai, toleran, moderat, dan saling menghormati.",
  },
  {
    title: "Meningkatkan Mutu Pendidikan",
    desc: "Mendorong kualitas pendidikan agama dan pendidikan keagamaan yang unggul, inklusif, dan berkarakter.",
  },
  {
    title: "Mewujudkan Tata Kelola Bersih",
    desc: "Memperkuat birokrasi yang akuntabel, profesional, transparan, dan berorientasi pada pelayanan publik.",
  },
  {
    title: "Mengoptimalkan Transformasi Digital",
    desc: "Memanfaatkan teknologi informasi untuk mempercepat layanan dan meningkatkan keterbukaan informasi publik.",
  },
];

export default function TujuanPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      <PageBanner
        title={t("nav.tujuan")}
        description="Tujuan kelembagaan diarahkan untuk memperkuat kualitas pelayanan, meningkatkan kepercayaan publik, dan menghadirkan manfaat nyata bagi masyarakat Kabupaten Barito Utara."
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.profil") },
          { label: t("nav.tujuan") },
        ]}
      />

      <section className="relative w-full px-6 py-14 sm:px-10 lg:px-16 xl:px-20">
        <div className="space-y-5">
          {goals.map((goal, index) => (
            <div
              key={goal.title}
              className="group grid gap-5 rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900 md:grid-cols-[90px_1fr]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                  {goal.title}
                </h2>
                <p className="mt-3 text-sm leading-8 text-slate-600 dark:text-slate-400">
                  {goal.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-4xl bg-linear-to-r from-emerald-700 to-teal-700 p-8 text-white shadow-xl">
          <h2 className="text-3xl font-black">
            Tujuan yang Terukur, Pelayanan yang Berdampak
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-8 text-emerald-50 dark:text-emerald-100">
            Setiap tujuan diarahkan untuk memperkuat pelayanan keagamaan yang
            unggul, meningkatkan tata kelola yang bersih, serta membangun
            hubungan yang semakin dekat antara Kemenag dan masyarakat.
          </p>
        </div>
      </section>
    </main>
  );
}
