import React from "react";
import Link from "next/link";
import {
  Building2,
  ChevronRight,
  User,
  Smartphone,
  Users,
  FileText,
  ExternalLink,
  Clock,
  ArrowRight
} from "lucide-react";
import PageBanner from "@/components/common/PageBanner";

// Icon mapping helper
const IconMap = {
  Smartphone: Smartphone,
  Users: Users,
  FileText: FileText,
  Building2: Building2
};

export default function SeksiDetailUI({ data, breadcrumb, menuTitle }) {
  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-[#050B14]">
      <PageBanner
        title={menuTitle || data.judul}
        description={data.deskripsi}
        breadcrumb={breadcrumb}
        eyebrow="Layanan Publik"
      />

      {/* Main Content Area - Full Width to match PageBanner */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 mt-10 relative z-10 space-y-6">

        {/* 1. Profil Kepala Seksi - Shadcn Card Style */}
        <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-50 flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 shadow-sm">
            {data.foto_kepala ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.foto_kepala} alt={data.nama_kepala} className="h-full w-full rounded-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-slate-400" />
            )}
            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"></div>
          </div>
          <div className="text-center sm:text-left flex-1 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Pejabat Struktural</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">{data.nama_kepala}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">NIP. {data.nip_kepala}</p>
          </div>
        </div>

        {/* Layout Grid (2/3 Left, 1/3 Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* KIRI: Konten Utama (Col-span-2) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Daftar Pegawai */}
            {data.pegawai && data.pegawai.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-50">
                <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-800/50">
                  <h3 className="text-lg font-semibold leading-none tracking-tight">Struktur Pegawai</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Tim yang bertugas melayani di {data.judul}.
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.pegawai.map((pegawai, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all">
                        <div className="relative h-16 w-16 mb-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 ring-2 ring-white dark:ring-slate-950 shadow-sm flex items-center justify-center">
                          {pegawai.foto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pegawai.foto} alt={pegawai.nama} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-8 w-8 text-slate-400" />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">{pegawai.nama}</h4>
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wider">{pegawai.jabatan}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">NIP. {pegawai.nip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Katalog Layanan Publik */}
            <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-50">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-800/50">
                <h3 className="text-lg font-semibold leading-none tracking-tight">Katalog Layanan Publik</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Daftar layanan administrasi dan publik yang difasilitasi oleh {data.judul}.
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.layanan_ptsp.map((layanan, idx) => (
                    <div key={idx} className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <span className="text-sm font-bold">{idx + 1}</span>
                        </div>
                        <h4 className="font-semibold text-sm leading-tight text-slate-900 dark:text-white">{layanan.nama}</h4>
                      </div>
                      <div className="mt-auto ml-11 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Estimasi: {layanan.estimasi}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: Call to Action & Aplikasi (Col-span-1) */}
          <div className="space-y-6">

            {/* CTA PTSP (Shadcn style primary emphasis) */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-950 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent dark:from-emerald-900/20 dark:to-transparent pointer-events-none"></div>
              <div className="p-6 relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/50">
                  <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Butuh Layanan Ini?</h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300/80">
                    Ketahui persyaratan lengkap dan ajukan permohonan secara online.
                  </p>
                </div>
                <Link
                  href="/layanan/ptsp"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-700"
                >
                  Ajukan via PTSP
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Shortcut Aplikasi */}
            {data.link_aplikasi && data.link_aplikasi.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-50">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
                  <h3 className="font-semibold text-sm">Aplikasi Terintegrasi</h3>
                </div>
                <div className="p-4 space-y-3">
                  {data.link_aplikasi.map((app, idx) => {
                    const IconComponent = IconMap[app.icon] || ExternalLink;
                    return (
                      <a
                        key={idx}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex w-full items-center justify-between rounded-md border border-slate-200 bg-transparent px-4 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-4 w-4 text-slate-500 group-hover:text-emerald-500" />
                          <span>{app.nama}</span>
                        </div>
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
