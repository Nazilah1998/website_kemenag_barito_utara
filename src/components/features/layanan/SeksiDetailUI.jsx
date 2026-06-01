import React from "react";
import Image from "next/image";
import { User } from "lucide-react";
import PageBanner from "@/components/common/PageBanner";

export default function SeksiDetailUI({ data, breadcrumb, menuTitle }) {
  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-[#050B14]">
      <PageBanner
        title={menuTitle || data.judul}
        description=""
        breadcrumb={breadcrumb}
        eyebrow="Layanan Publik"
      />

      {/* Main Content Area - Full Width to match PageBanner */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 mt-10 relative z-10 space-y-6">

        {/* 1. Profil Kepala Seksi - Shadcn Card Style */}
        <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-50 flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 shadow-sm">
            {data.foto_kepala ? (
              <Image src={data.foto_kepala} alt={data.nama_kepala} width={96} height={96} className="h-full w-full rounded-full object-cover" style={{ objectPosition: `50% ${data.foto_kepala_y ?? 50}%` }} />
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

        {/* 2. Daftar Pegawai - Full Width Container */}
        {data.pegawai && data.pegawai.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-50">
            <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100 dark:border-slate-800/50">
              <h3 className="text-lg font-semibold leading-none tracking-tight">Struktur Pegawai</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tim yang bertugas melayani di {data.judul}.
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {data.pegawai.map((pegawai, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 hover:border-emerald-250 hover:bg-white transition-all">
                    <div className="relative h-16 w-16 mb-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 ring-2 ring-white dark:ring-slate-950 shadow-sm flex items-center justify-center">
                      {pegawai.foto ? (
                        <Image src={pegawai.foto} alt={pegawai.nama} width={64} height={64} className="h-full w-full object-cover" style={{ objectPosition: `50% ${pegawai.foto_y ?? 50}%` }} />
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

      </div>
    </div>
  );
}
