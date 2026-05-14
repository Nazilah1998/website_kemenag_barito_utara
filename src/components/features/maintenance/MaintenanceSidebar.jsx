import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SmallInfoCard } from "./MaintenanceUI";

export function MaintenanceSidebar() {
  return (
    <aside className="grid gap-4">
      <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
            <Image
              src="/assets/branding/kemenag.svg"
              alt="Logo Kementerian Agama"
              width={26}
              height={26}
              className="h-6 w-auto object-contain"
              style={{ width: "auto" }}
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Kemenag
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              Informasi Pembaruan
            </h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <SmallInfoCard title="Mode Maintenance" tone="slate">
            Fitur ini sedang ditutup sementara agar proses pembaruan dapat
            dilakukan tanpa mengganggu tampilan publik.
          </SmallInfoCard>

          <SmallInfoCard title="Fokus Perbaikan" tone="emerald">
            Kami sedang merapikan isi halaman, struktur penyajian, serta
            kualitas pengalaman pengguna.
          </SmallInfoCard>

          <SmallInfoCard title="Catatan" tone="amber">
            Silakan gunakan halaman lain yang sudah tersedia. Fitur ini akan
            dibuka kembali setelah proses pembaruan selesai.
          </SmallInfoCard>
        </div>
      </div>

      <div className="rounded-[28px] border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-5 shadow-[0_20px_60px_rgba(16,185,129,0.08)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
          Akses Cepat
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <QuickLink href="/" label="Beranda" />
          <QuickLink href="/berita" label="Berita" />
          <QuickLink href="/kontak" label="Kontak" />
        </div>
      </div>
    </aside>
  );
}

function QuickLink({ href, label }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"
    >
      <span>{label}</span>
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
