// src/data/navigation.js

export function getNavigationItems() {
  return [
    {
      label: "Profil",
      href: "/profil/sejarah",
      children: [
        { label: "Sejarah", href: "/profil/sejarah" },
        { label: "Visi & Misi", href: "/profil/visi-misi" },
        { label: "Tugas dan Fungsi", href: "/profil/tugas-fungsi" },
        { label: "Nilai Budaya Kerja", href: "/profil/nilai-budaya-kerja" },
        { label: "Tujuan", href: "/profil/tujuan" },
      ],
    },

    { label: "Berita", href: "/berita" },

    {
      label: "Layanan",
      href: "/layanan",
      children: [
        { label: "Sekjen", href: "/layanan/sekjen" },
        { label: "Seksi Bimas Islam", href: "/layanan/seksi-bimas-islam" },
        {
          label: "Seksi Pendidikan Agama Islam",
          href: "/layanan/seksi-pendidikan-agama-islam",
        },
        {
          label: "Seksi Pendidikan Diniyah Dan Pondok Pesantren",
          href: "/layanan/seksi-pendidikan-diniyah-dan-pondok-pesantren",
        },
        {
          label: "Seksi Pendidikan Madrasah",
          href: "/layanan/seksi-pendidikan-madrasah",
        },
        {
          label: "Penyelenggara Hindu",
          href: "/layanan/penyelenggara-hindu",
        },
        {
          label: "Penyelenggara Zakat Wakaf",
          href: "/layanan/penyelenggara-zakat-wakaf",
        },
        {
          label: "KUA (Kantor Urusan Agama)",
          href: "/layanan/kua-kantor-urusan-agama",
        },
      ],
    },

    {
      label: "Informasi",
      href: "/informasi",
      children: [
        { label: "Regulasi", href: "/informasi/regulasi" },
        { label: "Profil Pejabat", href: "/informasi/profil-pejabat" },
        {
          label: "Struktur Organisasi",
          href: "/informasi/struktur-organisasi",
        },
        { label: "Dasar Hukum", href: "/informasi/dasar-hukum" },
      ],
    },

    { label: "Survey", href: "/survey" },
    { label: "PPID", href: "/ppid" },

    {
      label: "Zona Integritas",
      href: "/zona-integritas",
      children: [
        {
          label: "Area Perubahan - ZI",
          href: "/zona-integritas/area-perubahan-zi",
        },
        {
          label: "Video Pembangunan - ZI",
          href: "/zona-integritas/video-pembangunan-zi",
        },
        {
          label: "Berita Zona Integritas - ZI",
          href: "/zona-integritas/berita-zona-integritas",
        },
      ],
    },

    { label: "Laporan", href: "/laporan" },

    { label: "Galeri", href: "/galeri" },
    { label: "Kontak", href: "/kontak" },
  ];
}
