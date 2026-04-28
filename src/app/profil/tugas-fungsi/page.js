"use client";

import React from "react";
import PageBanner from "@/components/common/PageBanner";
import { useLanguage } from "@/context/LanguageContext";

const tugasUtama = [
  "Melaksanakan pelayanan dan pembinaan di bidang urusan agama Islam, Kristen, Katolik, Hindu, Buddha, dan kepercayaan sesuai ketentuan yang berlaku.",
  "Menyelenggarakan pelayanan administrasi keagamaan yang cepat, transparan, akuntabel, dan berorientasi pada kebutuhan masyarakat.",
  "Mendorong peningkatan kualitas pendidikan agama dan pendidikan keagamaan di wilayah Kabupaten Barito Utara.",
];

const fungsiLayanan = [
  {
    title: "Perumusan Kebijakan Teknis",
    desc: "Menyusun arah pelaksanaan program dan layanan keagamaan sesuai kebijakan Kementerian Agama.",
  },
  {
    title: "Pelayanan Keagamaan",
    desc: "Memberikan layanan publik di bidang nikah, rujuk, haji, umrah, zakat, wakaf, bimbingan masyarakat, dan layanan keagamaan lainnya.",
  },
  {
    title: "Pembinaan Pendidikan",
    desc: "Melakukan pembinaan madrasah, pendidikan agama, pendidikan keagamaan, serta peningkatan mutu kelembagaan pendidikan.",
  },
  {
    title: "Kerukunan Umat Beragama",
    desc: "Memperkuat moderasi beragama, toleransi, dan harmoni sosial di tengah masyarakat.",
  },
  {
    title: "Tata Kelola Organisasi",
    desc: "Mengelola administrasi, kepegawaian, keuangan, data, informasi, dan aset secara profesional.",
  },
  {
    title: "Pengawasan dan Evaluasi",
    desc: "Melaksanakan monitoring, evaluasi, dan pelaporan untuk memastikan layanan berjalan efektif dan akuntabel.",
  },
];

const indikator = ["Responsif", "Akuntabel", "Transparan", "Profesional"];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TugasFungsiPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      <PageBanner
        title={t("nav.tugasFungsi")}
        description="Kementerian Agama Kabupaten Barito Utara melaksanakan pelayanan, pembinaan, koordinasi, dan tata kelola urusan keagamaan secara profesional, berintegritas, dan berorientasi pada kepentingan masyarakat."
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.profil") },
          { label: t("nav.tugasFungsi") },
        ]}
      />

      <section className="relative w-full px-6 py-14 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-4 md:grid-cols-4">
          {indikator.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-lg font-black text-emerald-800 dark:text-emerald-400">
                {item}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Prinsip Layanan
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
              Tugas Utama
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-slate-100">
              Mandat Pelayanan Keagamaan
            </h2>

            <div className="mt-8 space-y-5">
              {tugasUtama.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-black text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-8 text-slate-600 dark:text-slate-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl bg-slate-950 p-8 text-white shadow-xl dark:bg-emerald-950/20 dark:ring-1 dark:ring-white/10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
              Orientasi Kerja
            </p>

            <h2 className="mt-4 text-3xl font-black">
              Melayani Umat dengan Integritas dan Profesionalitas
            </h2>

            <p className="mt-5 text-sm leading-8 text-slate-300 dark:text-slate-400">
              Setiap fungsi kelembagaan diarahkan untuk menghadirkan pelayanan
              yang mudah diakses, tertib administrasi, transparan, dan mampu
              menjawab kebutuhan masyarakat secara nyata.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Pelayanan Publik",
                "Moderasi Beragama",
                "Pendidikan Agama",
                "Tata Kelola Bersih",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold text-white backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
              Fungsi Kelembagaan
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-slate-100">
              Ruang Lingkup Pelaksanaan Fungsi
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {fungsiLayanan.map((item) => (
              <div
                key={item.title}
                className="group rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 transition group-hover:bg-emerald-700 group-hover:text-white dark:bg-emerald-900/30 dark:text-emerald-400 dark:group-hover:bg-emerald-600 dark:group-hover:text-white">
                  <CheckIcon />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-slate-100">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-4xl bg-linear-to-r from-emerald-700 to-teal-700 p-8 text-white shadow-xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-black">Komitmen Pelayanan Prima</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-50">
                Seluruh tugas dan fungsi dijalankan sebagai bentuk tanggung
                jawab dalam menghadirkan layanan keagamaan yang berkualitas,
                inklusif, dan terpercaya bagi masyarakat Kabupaten Barito Utara.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-6 py-4 text-center text-emerald-800 shadow-lg dark:bg-slate-900 dark:text-emerald-400">
              <p className="text-3xl font-black">Kemenag</p>
              <p className="text-xs font-bold uppercase tracking-[0.25em]">
                Barito Utara
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
