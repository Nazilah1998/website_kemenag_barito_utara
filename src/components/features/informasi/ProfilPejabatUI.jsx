"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageBanner from "@/components/common/PageBanner";
import Avatar from "@/components/ui/Avatar";

function BadgeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ChevronDownIcon({ open }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── KEPALA KANTOR CARD (featured) ────────────────────────────────────────────
function KepalaKantorCard({ pejabat }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-[#022c22] border border-slate-800/60 text-white shadow-2xl animate-fade-in-up">
      {/* Subtle modern glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-[80px]" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />
      
      {/* Glowing Gradient Top Line */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 inset-x-0 h-8 bg-emerald-400/30 blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-8 lg:p-12">
        {/* Photo */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl opacity-30 group-hover:opacity-100 transition-opacity duration-700" />
          <Avatar
            src={pejabat.foto_kepala}
            alt={pejabat.nama_kepala}
            className="relative h-56 w-56 lg:h-64 lg:w-64 overflow-hidden rounded-2xl border border-white/10 shadow-2xl object-cover transition-all duration-700"
            sizes="(max-width: 1024px) 14rem, 16rem"
            priority={true}
            foto_kepala_y={pejabat.foto_kepala_y ?? 50}
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Kepala Kantor
          </div>
          
          <h2 className="mt-4 text-3xl lg:text-4xl font-bold tracking-tight text-white">
            {pejabat.nama_kepala}
          </h2>
          <p className="mt-2 text-sm font-medium text-emerald-100/70 uppercase tracking-widest">
            Kementerian Agama Kabupaten Barito Utara
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-800 bg-emerald-900/50 px-4 py-2">
              <BadgeIcon />
              <span className="font-mono text-sm text-emerald-50 tracking-wider">
                {pejabat.nip_kepala ? `NIP. ${pejabat.nip_kepala}` : "NIP. -"}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-emerald-800/50 pt-6">
            <p className="max-w-2xl text-sm leading-relaxed text-emerald-100/80">
              {pejabat.deskripsi}
            </p>
          </div>

          <div className="mt-8 flex justify-center lg:justify-start">
            <Link
              href="/informasi/struktur-organisasi"
              className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
            >
              <UsersIcon />
              Lihat Struktur Organisasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REGULAR PEJABAT CARD ─────────────────────────────────────────────────────
function PejabatCard({ pejabat, index }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = pejabat.deskripsi && pejabat.deskripsi.length > 120;

  return (
    <div className="h-full group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-emerald-400/30 transition-all duration-500 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500/30 animate-fade-in-up">
      {/* Glowing Gradient Top Line */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 inset-x-0 h-6 bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-1 flex-col items-center gap-6 p-6 text-center">
        {/* Photo */}
        <div className="relative shrink-0 mt-2">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Avatar
            src={pejabat.foto_kepala}
            alt={pejabat.nama_kepala}
            className="relative h-32 w-32 overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all duration-500 dark:border-slate-700 object-cover"
            sizes="8rem"
            foto_kepala_y={pejabat.foto_kepala_y ?? 50}
          />
        </div>

        {/* Name & position */}
        <div className="w-full flex flex-col items-center">
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {pejabat.nama_kepala}
          </h3>
          <p className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {pejabat.judul === "Sub Bagian Tata Usaha"
              ? "Kepala Sub Bagian Tata Usaha"
              : `Kepala ${pejabat.judul}`}
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-md bg-slate-50 border border-slate-100 px-3 py-1.5 dark:bg-slate-800/50 dark:border-slate-700/50">
            <BadgeIcon />
            <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300 tracking-wide">
              {pejabat.nip_kepala ? `NIP. ${pejabat.nip_kepala}` : "NIP. -"}
            </span>
          </div>
        </div>

        {/* Description with expand */}
        {pejabat.deskripsi && (
          <div className="w-full text-left border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-auto">
            <p
              className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${!expanded && isLong ? "line-clamp-3" : ""}`}
            >
              {pejabat.deskripsi}
            </p>
            {isLong && (
               <div className="mt-3 text-center">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="inline-flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors"
                  >
                    {expanded ? "Tutup" : "Selengkapnya"}
                    <ChevronDownIcon open={expanded} />
                  </button>
               </div>
            )}
          </div>
        )}

        {/* CTA - jumlah pegawai badge */}
        {pejabat._count?.pegawai_seksi != null && (
          <div className="w-full mt-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <Link
              href={pejabat.slug ? `/informasi/profil-pejabat/${pejabat.slug}` : "#"}
              className="group/btn flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white"
            >
              <UsersIcon />
              {pejabat._count.pegawai_seksi} Staf Pegawai
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function ProfilPejabatUI({
  breadcrumb,
  kepalaKantor,
  pejabatList,
}) {
  return (
    <>
      <PageBanner
        title="Profil Pejabat"
        description="Kenali para pemimpin dan pejabat struktural yang mengabdi di Kantor Kementerian Agama Kabupaten Barito Utara."
        breadcrumb={breadcrumb}
        eyebrow="Informasi Kepegawaian"
      />

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-12 lg:py-16 space-y-14">
        {/* ── Kepala Kantor Featured ── */}
        {kepalaKantor && (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-900" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400">
                Pimpinan Tertinggi
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-emerald-200 to-transparent dark:from-emerald-900" />
            </div>
            <KepalaKantorCard pejabat={kepalaKantor} />
          </section>
        )}

        {/* ── Pejabat Struktural Grid ── */}
        {pejabatList && pejabatList.length > 0 && (
          <section>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                  Pejabat Struktural
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent dark:from-slate-700" />
              </div>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
                Para pejabat yang memimpin bidang dan seksi di lingkungan
                Kemenag Barito Utara
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {pejabatList.map((p, i) => (
                <div
                  key={p.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] flex"
                >
                  <div className="w-full h-full">
                    <PejabatCard pejabat={p} index={i + 1} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Bottom info strip ── */}
        <div className="rounded-[2rem] border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50 p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50">
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Informasi Kepegawaian
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Data profil pejabat diperbarui secara berkala. Untuk informasi
              lebih lanjut mengenai kepegawaian, silakan menghubungi{" "}
              <strong>Sub Bagian Tata Usaha</strong> Kemenag Barito Utara.
            </p>
          </div>
          <Link
            href="/kontak"
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow transition hover:bg-slate-700 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-slate-200"
          >
            Hubungi Kami
            <ExternalLinkIcon />
          </Link>
        </div>
      </div>
    </>
  );
}
