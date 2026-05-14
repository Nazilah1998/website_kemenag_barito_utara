import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StatusPill, CheckItem, WarningIcon } from "./MaintenanceUI";

export function MaintenanceContent({ title, featureName, description }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur">
      <div className="absolute right-0 top-0 h-36 w-36 translate-x-10 -translate-y-10 rounded-full bg-emerald-100/80 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-28 w-28 -translate-x-8 translate-y-8 rounded-full bg-amber-100/80 blur-2xl" />

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7 lg:p-8">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StatusPill tone="emerald">Maintenance</StatusPill>
            <StatusPill tone="amber">Coming Soon</StatusPill>
          </div>

          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 shadow-sm">
              <Image
                src="/assets/branding/kemenag.svg"
                alt="Logo Kementerian Agama"
                width={40}
                height={40}
                priority
                className="h-10 w-auto object-contain"
                style={{ width: "auto" }}
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Kemenag Barito Utara
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Informasi publik sedang diperbarui
              </p>
            </div>
          </div>

          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.95fr]">
          <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-600 p-5 text-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                  Status Layanan
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {featureName} sementara belum tersedia
                </h2>
              </div>

              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <WarningIcon className="h-6 w-6" />
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-white/90">
              Halaman ini sengaja ditampilkan dalam mode maintenance agar proses
              pembaruan dapat dilakukan dengan lebih rapi, aman, dan
              terstruktur.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Beranda
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Kontak
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Dalam Proses
            </p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">
              Yang sedang kami siapkan
            </h3>

            <ul className="mt-4 space-y-3">
              <CheckItem>Tampilan lebih ringkas, jelas, dan modern</CheckItem>
              <CheckItem>Struktur data dan konten yang lebih rapi</CheckItem>
              <CheckItem>Navigasi yang lebih nyaman digunakan</CheckItem>
              <CheckItem>Penyesuaian kualitas layanan informasi publik</CheckItem>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
