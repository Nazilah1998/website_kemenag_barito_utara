"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageBanner from "@/components/common/PageBanner";
import Avatar from "@/components/ui/Avatar";

function BadgeIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#052033] via-[#0b3b46] to-[#0e5f55] text-white shadow-2xl shadow-emerald-900/30 animate-fade-in-up">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-8 lg:p-12">
        {/* Photo */}
        <div className="relative shrink-0">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-amber-400/40 via-emerald-400/20 to-transparent blur-xl" />
          <Avatar
            src={pejabat.foto_kepala}
            alt={pejabat.nama_kepala}
            className="relative h-52 w-52 lg:h-64 lg:w-64 overflow-hidden rounded-full ring-4 ring-white/20 shadow-2xl"
            sizes="(max-width: 1024px) 13rem, 16rem"
            priority={true}
            foto_kepala_y={pejabat.foto_kepala_y ?? 50}
          />
          {/* Gold crown badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-1.5 shadow-lg shadow-amber-900/40">
            <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[9px] font-black tracking-widest text-white uppercase">
              Kepala Kantor
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center lg:text-left">
          <p className="mb-2 inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
            Kementerian Agama Kabupaten Barito Utara
          </p>
          <h2 className="mt-3 text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
            {pejabat.nama_kepala}
          </h2>
          <p className="mt-1.5 text-sm font-semibold text-white/60">
            {pejabat.judul}
          </p>

          <div className="mt-5 inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-3">
            <BadgeIcon />
            <span className="font-mono text-xs text-white/80 tracking-wide">
              NIP. {pejabat.nip_kepala || "-"}
            </span>
          </div>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 lg:text-base">
            {pejabat.deskripsi}
          </p>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
            <Link
              href="/informasi/struktur-organisasi"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-6 py-3 text-xs font-black uppercase tracking-widest text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
            >
              <UsersIcon />
              Struktur Organisasi
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
    <div className="h-full group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-lg shadow-slate-100/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-800 animate-fade-in-up">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-1 flex-col items-center gap-5 p-7 text-center">
        {/* Photo */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
          <Avatar
            src={pejabat.foto_kepala}
            alt={pejabat.nama_kepala}
            className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-slate-100 shadow-lg group-hover:ring-emerald-200 transition-all duration-300 dark:ring-slate-800 dark:group-hover:ring-emerald-800"
            sizes="8rem"
            foto_kepala_y={pejabat.foto_kepala_y ?? 50}
          />
        </div>

        {/* Name & position */}
        <div className="w-full">
          <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {pejabat.nama_kepala}
          </h3>
          <p className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            {pejabat.judul === "Sub Bagian Tata Usaha"
              ? "Kepala Sub Bagian Tata Usaha"
              : `Kepala ${pejabat.judul}`}
          </p>
          <div className="mt-3 mx-auto inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 dark:bg-slate-800 dark:border-slate-700">
            <BadgeIcon />
            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
              {pejabat.nip_kepala || "-"}
            </span>
          </div>
        </div>

        {/* Description with expand */}
        {pejabat.deskripsi && (
          <div className="w-full text-left border-t border-slate-100 dark:border-slate-800 pt-4 mt-1">
            <p
              className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed ${!expanded && isLong ? "line-clamp-2" : ""}`}
            >
              {pejabat.deskripsi}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
              >
                {expanded ? "Sembunyikan" : "Baca Selengkapnya"}
                <ChevronDownIcon open={expanded} />
              </button>
            )}
          </div>
        )}

        {/* CTA - jumlah pegawai badge */}
        {pejabat._count?.pegawai_seksi != null && (
          <Link
            href={pejabat.slug ? `/layanan/${pejabat.slug}` : "#"}
            className="mt-auto w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-100 bg-slate-50 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all hover:border-emerald-500 hover:bg-emerald-500 hover:text-white active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-600 dark:hover:border-emerald-600"
          >
            <UsersIcon />
            {pejabat._count.pegawai_seksi} Staf Pegawai
          </Link>
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
