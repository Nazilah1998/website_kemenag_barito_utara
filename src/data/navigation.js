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
        { label: "PTSP", href: "/layanan/ptsp" },
        { label: "Maklumat Pelayanan", href: "/layanan/maklumat-pelayanan" },
        { label: "Agen Perubahan", href: "/layanan/agen-perubahan" },
        { label: "Layanan Pengaduan", href: "/layanan/pengaduan" },
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
