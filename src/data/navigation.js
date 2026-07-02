// src/data/navigation.js

import { messages } from "./i18n";

export function getNavigationItems(locale = "id") {
  const m = messages[locale]?.nav || messages.id.nav;

  return [
    { label: m.home, href: "/beranda" },
    {
      label: m.profil,
      href: "/profil/sejarah",
      children: [
        { label: m.sejarah, href: "/profil/sejarah" },
        { label: m.visiMisi, href: "/profil/visi-misi" },
        { label: m.tugasFungsi, href: "/profil/tugas-fungsi" },
        { label: m.nilaiBudaya, href: "/profil/nilai-budaya-kerja" },
        { label: m.tujuan, href: "/profil/tujuan" },
      ],
    },

    { label: m.berita, href: "/berita" },
    { label: m.galeri, href: "/galeri" },
    { label: m.ppid, href: "/ppid" },

    {
      label: m.layanan,
      href: "/survey",
      children: [
        {
          label: m.layananInklusi,
          href: "https://inklusi.kemenag-baritoutara.com/",
        },
        { label: m.layananPtsp, href: "https://ptsp.kemenag-baritoutara.com/" },
        {
          label: m.layananArsip,
          href: "https://arsip.kemenag-baritoutara.com/",
        },
        {
          label: m.layananSurat,
          href: "https://surat.kemenag-baritoutara.com/",
        },
        { label: m.layananSop, href: "https://sop.kemenag-baritoutara.com/" },
        {
          label: m.layananPusdatin,
          href: "https://pusdatin.kemenag-baritoutara.com/",
        },
        { label: m.layananKalkulator, href: "/layanan/kalkulator" },
        { label: m.survey, href: "/survey" },
      ],
    },

    {
      label: m.informasi,
      href: "/informasi",
      children: [
        { label: m.pejabat, href: "/informasi/profil-pejabat" },
        { label: m.struktur, href: "/informasi/struktur-organisasi" },
        { label: m.regulasi, href: "/informasi/regulasi" },
        { label: m.dasarHukum, href: "/informasi/dasar-hukum" },
      ],
    },

    {
      label: m.laporan,
      href: "/laporan",
      children: [
        { label: m.laporanSop, href: "/laporan/sop" },
        { label: m.laporanRenstra, href: "/laporan/renstra" },
        { label: m.laporanPj, href: "/laporan/perjanjian-kinerja" },
        { label: m.laporanRk, href: "/laporan/rencana-kinerja" },
        { label: m.laporanCk, href: "/laporan/capaian-kinerja" },
        { label: m.laporanLkj, href: "/laporan/laporan-kinerja" },
        { label: m.laporanRkt, href: "/laporan/rencana-kerja-tahunan" },
      ],
    },

    {
      label: m.zi,
      href: "/zona-integritas",
      children: [
        { label: m.ziArea, href: "/zona-integritas/area-perubahan-zi" },
        { label: m.ziVideo, href: "/zona-integritas/video-pembangunan-zi" },
        { label: m.ziBerita, href: "/zona-integritas/berita-zona-integritas" },
      ],
    },

    { label: m.kontak, href: "/kontak" },
  ];
}
