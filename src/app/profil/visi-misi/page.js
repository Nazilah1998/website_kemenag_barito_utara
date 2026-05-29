"use client";

import React, { useState, useEffect } from "react";
import PageBanner from "@/components/common/PageBanner";
import { useLanguage } from "@/context/LanguageContext";

const FALLBACK_VISION =
  "Terwujudnya masyarakat Kabupaten Barito Utara yang taat beragama, rukun, cerdas, mandiri, dan sejahtera lahir batin.";

const FALLBACK_MISSIONS = [
  "Meningkatkan kualitas pemahaman dan pengamalan ajaran agama dalam kehidupan masyarakat.",
  "Memperkuat kerukunan umat beragama melalui moderasi, toleransi, dan harmoni sosial.",
  "Meningkatkan kualitas pendidikan agama dan pendidikan keagamaan yang unggul dan berdaya saing.",
  "Mewujudkan pelayanan publik yang mudah, cepat, transparan, dan akuntabel.",
  "Memperkuat tata kelola kelembagaan yang profesional, bersih, dan berintegritas.",
];

export default function VisiMisiPage() {
  const { t } = useLanguage();
  const [vision, setVision] = useState(FALLBACK_VISION);
  const [missions, setMissions] = useState(FALLBACK_MISSIONS);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/static-pages?slug=visi-misi", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.content) {
          try {
            const parsed = JSON.parse(data.content);
            if (parsed.vision) setVision(parsed.vision);
            if (Array.isArray(parsed.missions) && parsed.missions.length > 0)
              setMissions(parsed.missions);
          } catch {}
        }
      })
      .catch((e) => { if (e?.name !== "AbortError") {} });
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      <PageBanner
        title={t("nav.visiMisi")}
        description="Arah strategis dalam membangun pelayanan keagamaan yang profesional, moderat, akuntabel, dan berorientasi pada kepentingan masyarakat."
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.profil") },
          { label: t("nav.visiMisi") },
        ]}
      />

      <section className="relative w-full px-6 py-14 sm:px-10 lg:px-16 xl:px-20">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
            Visi
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 dark:text-slate-100 md:text-4xl">
            {vision}
          </h2>
        </div>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
            Misi
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-slate-100">
            Langkah Strategis Pelayanan
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {missions.map((mission, index) => (
              <div
                key={mission}
                className="group rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {index + 1}
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                  Misi {index + 1}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {mission}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
