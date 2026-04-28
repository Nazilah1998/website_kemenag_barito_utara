"use client";

import React from "react";
import PageBanner from "@/components/common/PageBanner";
import { useLanguage } from "@/context/LanguageContext";

const values = [
  {
    title: "Integritas",
    desc: "Keselarasan antara hati, pikiran, perkataan, dan perbuatan yang baik dan benar.",
  },
  {
    title: "Profesionalitas",
    desc: "Bekerja secara disiplin, kompeten, bertanggung jawab, dan berorientasi pada hasil terbaik.",
  },
  {
    title: "Inovasi",
    desc: "Menyempurnakan proses kerja agar layanan semakin cepat, mudah, adaptif, dan relevan.",
  },
  {
    title: "Tanggung Jawab",
    desc: "Melaksanakan amanah pekerjaan dengan sungguh-sungguh, tuntas, dan dapat dipertanggungjawabkan.",
  },
  {
    title: "Keteladanan",
    desc: "Menjadi contoh dalam sikap, perilaku, etika kerja, dan pelayanan kepada masyarakat.",
  },
];

export default function NilaiBudayaKerjaPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      <PageBanner
        title={t("nav.nilaiBudaya")}
        description="Lima nilai budaya kerja menjadi fondasi aparatur dalam membangun pelayanan publik yang ramah, profesional, dan berorientasi pada kepentingan masyarakat."
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.profil") },
          { label: t("nav.nilaiBudaya") },
        ]}
      />

      <section className="relative w-full px-6 py-14 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="group rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-800 transition group-hover:bg-emerald-700 group-hover:text-white dark:bg-emerald-900/30 dark:text-emerald-400 dark:group-hover:bg-emerald-600 dark:group-hover:text-white">
                {index + 1}
              </div>

              <h2 className="mt-6 text-xl font-black text-slate-950 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                {value.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {value.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-4xl bg-slate-950 p-8 text-white shadow-xl dark:bg-emerald-950/20 dark:ring-1 dark:ring-white/10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
            Komitmen Aparatur
          </p>

          <h2 className="mt-4 text-3xl font-black">
            Bekerja dengan Nilai, Melayani dengan Hati
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-300 dark:text-slate-400">
            Nilai budaya kerja tidak hanya menjadi slogan, tetapi menjadi
            pedoman nyata dalam membangun pelayanan yang berintegritas,
            profesional, inovatif, bertanggung jawab, dan memberi keteladanan
            bagi masyarakat.
          </p>
        </div>
      </section>
    </main>
  );
}
