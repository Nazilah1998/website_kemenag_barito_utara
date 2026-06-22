"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DesktopClockSection, MobileClockSection } from "./ClockSection";
import HeroBackground from "./HeroBackground";
import VisitorStats from "./VisitorStats";
import { useSiteSettings } from "@/context/SettingsContext";

const PTSP_MENUS = [
  {
    title: "Masuk PTSP",
    href: "https://ptsp.kemenag-baritoutara.com/",
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      </svg>
    ),
  },
  {
    title: "Buat Akun Pemohon",
    href: "https://ptsp.kemenag-baritoutara.com/login/pemohon",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
  },
  {
    title: "Katalog Layanan PTSP",
    href: "https://ptsp.kemenag-baritoutara.com/layanan",
    icon: (
      <svg
        className="w-5 h-5 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    title: "Lacak Layanan",
    href: "https://ptsp.kemenag-baritoutara.com/track",
    icon: (
      <svg
        className="w-5 h-5 text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3l2 2"
        />
      </svg>
    ),
  },
  {
    title: "Buku Tamu",
    href: "https://ptsp.kemenag-baritoutara.com/buku-tamu",
    icon: (
      <svg
        className="w-5 h-5 text-rose-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Janji Temu",
    href: "https://ptsp.kemenag-baritoutara.com/janji-temu",
    icon: (
      <svg
        className="w-5 h-5 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

const INOVASI_MENUS = [
  {
    title: "PTSP Kemenag Barito Utara",
    href: "https://ptsp.kemenag-baritoutara.com/",
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "E-Surat Kemenag Barito Utara",
    href: "https://surat.kemenag-baritoutara.com/login",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "E-Arsip Kemenag Barito Utara",
    href: "https://arsip.kemenag-baritoutara.com/login",
    icon: (
      <svg
        className="w-5 h-5 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
  },
  {
    title: "E-SOP Kemenag Barito Utara",
    href: "https://sop.kemenag-baritoutara.com/",
    icon: (
      <svg
        className="w-5 h-5 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Pusdatin (Segera Hadir)",
    href: "https://pusdatin.kemenag-baritoutara.com/",
    icon: (
      <svg
        className="w-5 h-5 text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
  },
];

const INFORMASI_MENUS = [
  {
    title: "Berita",
    href: "https://baritoutara.kemenag.go.id/berita",
    icon: (
      <svg
        className="w-5 h-5 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
  },
  {
    title: "Galeri",
    href: "https://baritoutara.kemenag.go.id/galeri",
    icon: (
      <svg
        className="w-5 h-5 text-fuchsia-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Dokumen Laporan",
    href: "https://baritoutara.kemenag.go.id/laporan",
    icon: (
      <svg
        className="w-5 h-5 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

const SURVEY_MENUS = [
  {
    title: "Masuk Layanan Survey",
    href: "https://baritoutara.kemenag.go.id/survey",
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      </svg>
    ),
  },
  {
    title: "Survey Kepuasan Masyarakat (SKM)",
    href: "/survey/skm",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Survey Persepsi Anti Korupsi (SPAK)",
    href: "/survey/spak",
    icon: (
      <svg
        className="w-5 h-5 text-rose-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  {
    title: "Survey Pelayanan PTSP",
    href: "/survey/ptsp",
    icon: (
      <svg
        className="w-5 h-5 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
];

const ZONA_MENUS = [
  {
    title: "Masuk Zona Integritas",
    href: "https://baritoutara.kemenag.go.id/zona-integritas",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 8.9c.228.033.445.133.615.285l2.772 2.443a.5.5 0 010 .744l-2.772 2.443a1.056 1.056 0 01-.615.285 3.323 3.323 0 00-6.013 3.116 3.323 3.323 0 006.013 3.116c.228-.033.445-.133.615-.285l2.772-2.443a.5.5 0 010-.744l-2.772-2.443a1.056 1.056 0 01.615-.285 3.323 3.323 0 006.013-3.116 3.323 3.323 0 00-6.013-3.116z"
        />
      </svg>
    ),
  },
  {
    title: "Berita Zona Integritas",
    href: "https://baritoutara.kemenag.go.id/zona-integritas/berita-zona-integritas",
    icon: (
      <svg
        className="w-5 h-5 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
  },
  {
    title: "Area Perubahan - ZI",
    href: "https://baritoutara.kemenag.go.id/zona-integritas/area-perubahan-zi",
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
        />
      </svg>
    ),
  },
  {
    title: "Video Pembangunan - ZI",
    href: "https://baritoutara.kemenag.go.id/zona-integritas/video-pembangunan-zi",
    icon: (
      <svg
        className="w-5 h-5 text-rose-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const PENGADUAN_MENUS = [
  {
    title: "E-Pengaduan",
    href: "https://ptsp.kemenag-baritoutara.com/e-pengaduan",
    icon: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "SP4N-LAPOR!",
    href: "https://www.lapor.go.id/",
    icon: (
      <svg
        className="w-5 h-5 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
        />
      </svg>
    ),
  },
  {
    title: "Whistle Blower System",
    href: "https://simdumas.kemenag.go.id/",
    icon: (
      <svg
        className="w-5 h-5 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
  },
];

const PORTAL_LINKS = [
  {
    title: "Website Utama",
    description: "Informasi publik, berita, dan layanan keagamaan terlengkap.",
    href: "/beranda",
    icon: (
      <svg
        className="w-8 h-8 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    primary: true,
  },
  {
    id: "ptsp",
    title: "Layanan PTSP",
    description:
      "Pusat Layanan Terpadu Satu Pintu untuk segala urusan administrasi.",
    href: "#",
    icon: (
      <svg
        className="w-8 h-8 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: "inovasi",
    title: "Inovasi Kemenag",
    description:
      "Kumpulan aplikasi dan inovasi layanan digital Kemenag Barito Utara.",
    href: "#",
    icon: (
      <svg
        className="w-8 h-8 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    id: "informasi",
    title: "Informasi Publik",
    description: "Kumpulan berita, galeri kegiatan, dan laporan instansi.",
    href: "#",
    icon: (
      <svg
        className="w-8 h-8 text-fuchsia-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    id: "pengaduan",
    title: "Layanan Pengaduan",
    description: "Saluran penyampaian pengaduan dan pelaporan masyarakat.",
    href: "#",
    icon: (
      <svg
        className="w-8 h-8 text-cyan-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    id: "survey",
    title: "Layanan Survey",
    description:
      "Bantu kami meningkatkan kualitas layanan dengan mengisi survey.",
    href: "#",
    icon: (
      <svg
        className="w-8 h-8 text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    id: "zona",
    title: "Zona Integritas",
    description:
      "Komitmen kami dalam mewujudkan birokrasi yang bersih dan melayani.",
    href: "#",
    icon: (
      <svg
        className="w-8 h-8 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 8.9c.228.033.445.133.615.285l2.772 2.443a.5.5 0 010 .744l-2.772 2.443a1.056 1.056 0 01-.615.285 3.323 3.323 0 00-6.013 3.116 3.323 3.323 0 006.013 3.116c.228-.033.445-.133.615-.285l2.772-2.443a.5.5 0 010-.744l-2.772-2.443a1.056 1.056 0 01.615-.285 3.323 3.323 0 006.013-3.116 3.323 3.323 0 00-6.013-3.116z"
        />
      </svg>
    ),
  },
  {
    title: "Kontak Kami",
    description: "Hubungi kami untuk informasi lebih lanjut dan bantuan.",
    href: "/kontak",
    icon: (
      <svg
        className="w-8 h-8 text-rose-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function PortalPage() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [portalData, setPortalData] = useState(null);
  const [portalError, setPortalError] = useState(false);
  const [portalLoading, setPortalLoading] = useState(true);
  const [isPtspModalOpen, setIsPtspModalOpen] = useState(false);
  const [isInovasiModalOpen, setIsInovasiModalOpen] = useState(false);
  const [isInformasiModalOpen, setIsInformasiModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [isZonaModalOpen, setIsZonaModalOpen] = useState(false);
  const [isPengaduanModalOpen, setIsPengaduanModalOpen] = useState(false);
  const { siteInfo } = useSiteSettings();

  useEffect(() => {
    fetch("/api/portal")
      .then((res) => res.json())
      .then((data) => {
        if (data?.beritaCount !== undefined) setPortalData(data);
        else setPortalError(true);
      })
      .catch(() => {
        setPortalError(true);
      })
      .finally(() => setPortalLoading(false));
  }, []);

  useEffect(() => {
    const detectPwa = () => {
      if (typeof window !== "undefined") {
        const isPwa =
          window.matchMedia("(display-mode: standalone)").matches ||
          window.navigator.standalone ||
          document.referrer.includes("android-app://");
        setIsStandalone(isPwa);
      }
    };

    const frame = requestAnimationFrame(() => {
      detectPwa();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-y-auto overflow-x-hidden bg-slate-900 selection:bg-emerald-500/30">
      <HeroBackground />
      {/* SHARED CENTERED WRAPPER */}
      <div className="flex-1 flex flex-col justify-center w-full relative z-10 py-4 md:py-8">
        {/* DESKTOP VERSION */}
        <div className="animate-fade-in hidden md:flex w-full px-6 lg:px-10 xl:px-16 flex-col">
          <div className="flex flex-col items-center justify-center">
          {/* Logo & Title Section */}
          <div
            className="animate-fade-in flex flex-col items-center text-center mb-2"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-16 h-16 mb-3 relative bg-white/10 backdrop-blur-md p-2 rounded-2xl ring-1 ring-white/20 shadow-2xl transition-transform hover:scale-105 duration-500">
              <Image
                src={siteInfo.logoSrc}
                alt="Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain drop-shadow-lg"
                unoptimized
                priority
              />
            </div>
            <p className="mb-1 text-sm font-black uppercase tracking-[0.4em] text-emerald-500/90">
              Portal Resmi
            </p>
            <h1 className="flex flex-col items-center font-black uppercase tracking-tight leading-none max-w-5xl px-2 text-center">
              <span className="text-2xl lg:text-3xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {siteInfo.logoTitleLine1}
              </span>
              <span className="text-2xl lg:text-3xl bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mt-1">
                {siteInfo.logoTitleLine2}
              </span>
            </h1>
            <p className="mt-1 text-slate-400 text-sm max-w-none font-medium px-4 whitespace-nowrap">
              Akses cepat informasi dan layanan keagamaan Kabupaten Barito Utara
              dalam satu pintu.
            </p>
          </div>

          {/* Status & Time Indicator - Desktop */}
          <DesktopClockSection />

          {/* Berita Ticker - Desktop */}
          {portalError ? (
            <div
              className="animate-fade-in w-full mt-1 overflow-hidden flex justify-center"
              style={{ animationDelay: "0.15s" }}
            >
              <span className="text-[10px] text-rose-400/80 font-medium bg-rose-500/10 px-3 py-1 rounded-full ring-1 ring-rose-500/20">
                Gagal memuat berita terbaru
              </span>
            </div>
          ) : (
            portalData?.latestBerita?.length > 0 && (
              <div
                className="animate-fade-in w-full mt-1 overflow-hidden"
                style={{ animationDelay: "0.15s" }}
              >
                <div className="relative flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full ring-1 ring-white/10">
                  <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full leading-none flex items-center justify-center">
                    Terbaru
                  </span>
                  <div className="overflow-hidden relative flex-1 flex items-center self-stretch">
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-0 h-full">
                      {[
                        ...portalData.latestBerita,
                        ...portalData.latestBerita,
                      ].map((item, i) => (
                        <React.Fragment key={`${item.slug}-${i}`}>
                          <Link
                            href={`/berita/${item.slug}`}
                            target={isStandalone ? undefined : "_blank"}
                            className="text-slate-300 text-[11px] font-medium hover:text-emerald-400 transition-colors shrink-0 leading-none flex items-center h-full"
                          >
                            {item.title}
                          </Link>
                          <span className="mx-3 text-slate-500/40 flex items-center h-full leading-none">
                            |
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Portal Grid Section */}
          <div className="flex items-center justify-center w-full mt-2 py-2">
            <div className="grid grid-cols-4 gap-x-5 gap-y-3 w-full">
              {PORTAL_LINKS.map((link, idx) => (
                <div
                  key={link.title}
                  className="animate-fade-in-up h-full"
                  style={{ animationDelay: `${0.2 + idx * 0.08}s` }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.id === "ptsp") {
                        e.preventDefault();
                        setIsPtspModalOpen(true);
                      } else if (link.id === "inovasi") {
                        e.preventDefault();
                        setIsInovasiModalOpen(true);
                      } else if (link.id === "informasi") {
                        e.preventDefault();
                        setIsInformasiModalOpen(true);
                      } else if (link.id === "survey") {
                        e.preventDefault();
                        setIsSurveyModalOpen(true);
                      } else if (link.id === "zona") {
                        e.preventDefault();
                        setIsZonaModalOpen(true);
                      } else if (link.id === "pengaduan") {
                        e.preventDefault();
                        setIsPengaduanModalOpen(true);
                      }
                    }}
                    target={
                      link.href.startsWith("http") && !link.id
                        ? "_blank"
                        : isStandalone
                          ? undefined
                          : "_blank"
                    }
                    rel={
                      link.href.startsWith("http") && !link.id
                        ? "noopener noreferrer"
                        : isStandalone
                          ? undefined
                          : "noopener noreferrer"
                    }
                    className={`group relative p-4 rounded-3xl transition-all duration-300 flex flex-col items-start text-left h-full hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.98] ${
                      link.primary
                        ? "bg-emerald-600/20 backdrop-blur-xl ring-1 ring-emerald-500/50 hover:bg-emerald-600/30"
                        : "bg-white/5 backdrop-blur-lg ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 shrink-0 ${
                        link.primary
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-800/50 text-slate-300 group-hover:text-emerald-400"
                      }`}
                    >
                      {link.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {link.title}
                      </h2>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {link.description}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex mt-auto pt-6 w-full justify-end">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          link.primary
                            ? "bg-emerald-500 text-white"
                            : "bg-white/10 text-white group-hover:bg-emerald-500 group-hover:translate-x-1"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* MOBILE VERSION */}
      <div className="animate-fade-in flex md:hidden w-full px-5 flex-col pb-2">
        <div className="flex flex-col items-center justify-center">
          {/* Logo & Title Section */}
          <div
            className="animate-fade-in flex flex-col items-center text-center mb-3"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-16 h-16 mb-2 relative bg-white/10 backdrop-blur-md p-2 rounded-2xl ring-1 ring-white/20 shadow-2xl">
              <Image
                src={siteInfo.logoSrc}
                alt="Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain drop-shadow-lg"
                unoptimized
                priority
              />
            </div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/90">
              Portal Resmi
            </p>
            <h1 className="flex flex-col items-center font-black uppercase tracking-tight leading-none px-2">
              <span className="text-lg bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {siteInfo.logoTitleLine1}
              </span>
              <span className="text-lg bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {siteInfo.logoTitleLine2}
              </span>
            </h1>
            <p className="mt-2 text-slate-400 text-[9px] font-medium px-2 leading-relaxed">
              Akses cepat informasi dan layanan keagamaan
              <br />
              Kabupaten Barito Utara dalam satu pintu.
            </p>
          </div>

          {/* Enhanced Status & Time - Mobile */}
          <MobileClockSection />

          {/* Berita Ticker - Mobile */}
          {portalError ? (
            <div
              className="animate-fade-in w-full mt-1 overflow-hidden flex justify-center"
              style={{ animationDelay: "0.15s" }}
            >
              <span className="text-[9px] text-rose-400/80 font-medium bg-rose-500/10 px-3 py-1 rounded-full ring-1 ring-rose-500/20">
                Gagal memuat berita terbaru
              </span>
            </div>
          ) : (
            portalData?.latestBerita?.length > 0 && (
              <div
                className="animate-fade-in w-full mt-1 overflow-hidden"
                style={{ animationDelay: "0.15s" }}
              >
                <div className="relative flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full ring-1 ring-white/10">
                  <span className="shrink-0 text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full leading-none flex items-center justify-center">
                    Baru
                  </span>
                  <div className="overflow-hidden relative flex-1 flex items-center self-stretch">
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-0 h-full">
                      {[
                        ...portalData.latestBerita,
                        ...portalData.latestBerita,
                      ].map((item, i) => (
                        <React.Fragment key={`${item.slug}-${i}`}>
                          <Link
                            href={`/berita/${item.slug}`}
                            target={isStandalone ? undefined : "_blank"}
                            className="text-slate-300 text-[10px] font-medium hover:text-emerald-400 transition-colors shrink-0 leading-none flex items-center h-full"
                          >
                            {item.title}
                          </Link>
                          <span className="mx-2.5 text-slate-500/40 flex items-center h-full leading-none">
                            |
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Portal Grid Section */}
          <div className="flex items-center justify-center w-full mt-2 py-1">
            <div className="grid grid-cols-2 gap-3 w-full">
              {PORTAL_LINKS.map((link, idx) => (
                <div
                  key={link.title}
                  className="animate-fade-in-up w-full"
                  style={{ animationDelay: `${0.2 + idx * 0.08}s` }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.id === "ptsp") {
                        e.preventDefault();
                        setIsPtspModalOpen(true);
                      } else if (link.id === "inovasi") {
                        e.preventDefault();
                        setIsInovasiModalOpen(true);
                      } else if (link.id === "informasi") {
                        e.preventDefault();
                        setIsInformasiModalOpen(true);
                      } else if (link.id === "survey") {
                        e.preventDefault();
                        setIsSurveyModalOpen(true);
                      } else if (link.id === "zona") {
                        e.preventDefault();
                        setIsZonaModalOpen(true);
                      } else if (link.id === "pengaduan") {
                        e.preventDefault();
                        setIsPengaduanModalOpen(true);
                      }
                    }}
                    target={
                      link.href.startsWith("http") && !link.id
                        ? "_blank"
                        : isStandalone
                          ? undefined
                          : "_blank"
                    }
                    rel={
                      link.href.startsWith("http") && !link.id
                        ? "noopener noreferrer"
                        : isStandalone
                          ? undefined
                          : "noopener noreferrer"
                    }
                    className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center w-full h-full hover:scale-[1.03] active:scale-[0.97] ${
                      link.primary
                        ? "bg-emerald-600/20 backdrop-blur-xl ring-1 ring-emerald-500/50"
                        : "bg-white/5 backdrop-blur-lg ring-1 ring-white/10"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 shrink-0 ${
                        link.primary
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-800/50 text-slate-300"
                      }`}
                    >
                      {link.icon}
                    </div>
                    <h2 className="text-[11px] font-bold text-white line-clamp-1">
                      {link.title}
                    </h2>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* PTSP Modal */}
      {isPtspModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
          {/* Backdrop Click Area */}
          <div
            className="absolute inset-0"
            onClick={() => setIsPtspModalOpen(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">Layanan PTSP</h3>
              </div>
              <button
                onClick={() => setIsPtspModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-3">
                {PTSP_MENUS.map((menu, idx) => (
                  <Link
                    key={idx}
                    href={menu.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsPtspModalOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-800 hover:bg-emerald-500/20 border border-transparent hover:border-emerald-500/30 transition-all duration-200 group shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-200">
                      {menu.icon}
                    </div>
                    <span className="flex-1 text-slate-200 font-semibold text-sm group-hover:text-emerald-400 transition-colors">
                      {menu.title}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Inovasi Modal */}
      {isInovasiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
          {/* Backdrop Click Area */}
          <div
            className="absolute inset-0"
            onClick={() => setIsInovasiModalOpen(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">
                  Inovasi Kemenag
                </h3>
              </div>
              <button
                onClick={() => setIsInovasiModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-3">
                {INOVASI_MENUS.map((menu, idx) => (
                  <Link
                    key={idx}
                    href={menu.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsInovasiModalOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-transparent hover:border-amber-500/30 transition-all duration-200 group shadow-sm relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-200">
                      {menu.icon}
                    </div>
                    <span className="flex-1 text-slate-200 font-semibold text-sm group-hover:text-amber-400 transition-colors">
                      {menu.title}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Informasi Publik Modal */}
      {isInformasiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
          {/* Backdrop Click Area */}
          <div
            className="absolute inset-0"
            onClick={() => setIsInformasiModalOpen(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">
                  Informasi Publik
                </h3>
              </div>
              <button
                onClick={() => setIsInformasiModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-3">
                {INFORMASI_MENUS.map((menu, idx) => (
                  <Link
                    key={idx}
                    href={menu.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsInformasiModalOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-800 hover:bg-fuchsia-500/20 border border-transparent hover:border-fuchsia-500/30 transition-all duration-200 group shadow-sm relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-fuchsia-500/20 group-hover:scale-110 transition-all duration-200">
                      {menu.icon}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-slate-200 font-semibold text-sm group-hover:text-fuchsia-400 transition-colors">
                        {menu.title}
                      </span>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-500 group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Layanan Survey Modal */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
          {/* Backdrop Click Area */}
          <div
            className="absolute inset-0"
            onClick={() => setIsSurveyModalOpen(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">Layanan Survey</h3>
              </div>
              <button
                onClick={() => setIsSurveyModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-3">
                {SURVEY_MENUS.map((menu, idx) => (
                  <Link
                    key={idx}
                    href={menu.href}
                    target={menu.href === "#" ? undefined : "_blank"}
                    rel={menu.href === "#" ? undefined : "noopener noreferrer"}
                    onClick={(e) => {
                      if (menu.href === "#") e.preventDefault();
                      setIsSurveyModalOpen(false);
                    }}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-800 hover:bg-purple-500/20 border border-transparent hover:border-purple-500/30 transition-all duration-200 group shadow-sm relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-200">
                      {menu.icon}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-slate-200 font-semibold text-sm group-hover:text-purple-400 transition-colors">
                        {menu.title}
                      </span>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Zona Integritas Modal */}
      {isZonaModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
          {/* Backdrop Click Area */}
          <div
            className="absolute inset-0"
            onClick={() => setIsZonaModalOpen(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 8.9c.228.033.445.133.615.285l2.772 2.443a.5.5 0 010 .744l-2.772 2.443a1.056 1.056 0 01-.615.285 3.323 3.323 0 00-6.013 3.116 3.323 3.323 0 006.013 3.116c.228-.033.445-.133.615-.285l2.772-2.443a.5.5 0 010-.744l-2.772-2.443a1.056 1.056 0 01.615-.285 3.323 3.323 0 006.013-3.116 3.323 3.323 0 00-6.013-3.116z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">
                  Zona Integritas
                </h3>
              </div>
              <button
                onClick={() => setIsZonaModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-3">
                {ZONA_MENUS.map((menu, idx) => (
                  <Link
                    key={idx}
                    href={menu.href}
                    target={menu.href === "#" ? undefined : "_blank"}
                    rel={menu.href === "#" ? undefined : "noopener noreferrer"}
                    onClick={(e) => {
                      if (menu.href === "#") e.preventDefault();
                      setIsZonaModalOpen(false);
                    }}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-800 hover:bg-emerald-500/20 border border-transparent hover:border-emerald-500/30 transition-all duration-200 group shadow-sm relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-200">
                      {menu.icon}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-slate-200 font-semibold text-sm group-hover:text-emerald-400 transition-colors">
                        {menu.title}
                      </span>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Layanan Pengaduan Modal */}
      {isPengaduanModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 animate-fade-in">
          {/* Backdrop Click Area */}
          <div
            className="absolute inset-0"
            onClick={() => setIsPengaduanModalOpen(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg">
                  Layanan Pengaduan
                </h3>
              </div>
              <button
                onClick={() => setIsPengaduanModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-3">
                {PENGADUAN_MENUS.map((menu, idx) => (
                  <Link
                    key={idx}
                    href={menu.href}
                    target={menu.href === "#" ? undefined : "_blank"}
                    rel={menu.href === "#" ? undefined : "noopener noreferrer"}
                    onClick={(e) => {
                      if (menu.href === "#") e.preventDefault();
                      setIsPengaduanModalOpen(false);
                    }}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-800 hover:bg-cyan-500/20 border border-transparent hover:border-cyan-500/30 transition-all duration-200 group shadow-sm relative overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-200">
                      {menu.icon}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-slate-200 font-semibold text-sm group-hover:text-cyan-400 transition-colors">
                        {menu.title}
                      </span>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visitor Statistics */}
      <VisitorStats />
      
      </div>

      {/* Shared Footer info */}
      <div
        className="animate-fade-in text-center opacity-60 hover:opacity-100 transition-opacity pb-1 sm:pb-2 pt-0.5 w-full"
        style={{ animationDelay: "0.3s" }}
      >
        <p className="text-slate-500 text-[8px] md:text-[10px] font-medium tracking-widest uppercase">
          &copy; {new Date().getFullYear()} {siteInfo.name}
        </p>
      </div>
    </div>
  );
}
