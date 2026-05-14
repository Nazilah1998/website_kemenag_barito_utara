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

    {
      label: m.layanan,
      href: "/layanan",
      children: [
        { label: m.sekjen, href: "/layanan/sekjen" },
        { label: m.bimasIslam, href: "/layanan/seksi-bimas-islam" },
        { label: m.pai, href: "/layanan/seksi-pendidikan-agama-islam" },
        {
          label: m.pdpontren,
          href: "/layanan/seksi-pendidikan-diniyah-dan-pondok-pesantren",
        },
        { label: m.penmad, href: "/layanan/seksi-pendidikan-madrasah" },
        { label: m.hindu, href: "/layanan/penyelenggara-hindu" },
        { label: m.zakat, href: "/layanan/penyelenggara-zakat-wakaf" },
        { label: m.kua, href: "/layanan/kua-kantor-urusan-agama" },
      ],
    },

    {
      label: m.informasi,
      href: "/informasi",
      children: [
        { label: m.regulasi, href: "/informasi/regulasi" },
        { label: m.pejabat, href: "/informasi/profil-pejabat" },
        { label: m.struktur, href: "/informasi/struktur-organisasi" },
        { label: m.dasarHukum, href: "/informasi/dasar-hukum" },
      ],
    },

    { label: m.survey, href: "/survey" },
    { label: m.ppid, href: "/ppid" },

    {
      label: m.zi,
      href: "/zona-integritas",
      children: [
        { label: m.ziArea, href: "/zona-integritas/area-perubahan-zi" },
        { label: m.ziVideo, href: "/zona-integritas/video-pembangunan-zi" },
        { label: m.ziBerita, href: "/zona-integritas/berita-zona-integritas" },
      ],
    },

    { label: m.laporan, href: "/laporan" },
    { label: m.galeri, href: "/galeri" },
    { label: m.kontak, href: "/kontak" },
  ];
}
