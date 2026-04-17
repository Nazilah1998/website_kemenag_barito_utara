export const laporanCategories = [
  {
    slug: "sop-dan-standar-pelayanan",
    title: "SOP dan Standar Pelayanan",
    description:
      "Standar Operasional Prosedur dan Standar Pelayanan untuk setiap layanan publik Kemenag Barito Utara.",
    intro:
      "Dokumen ini menjelaskan alur, persyaratan, waktu, biaya, dan prosedur layanan agar dapat diakses semua pihak secara transparan.",
    documents: [],
  },
  {
    slug: "renstra",
    title: "Rencana Strategis (Renstra)",
    description:
      "Rencana strategis lima tahunan yang memuat visi, misi, tujuan, sasaran, strategi, dan kebijakan.",
    intro:
      "Renstra menjadi pedoman arah pembangunan dan prioritas kerja Kementerian Agama Kabupaten Barito Utara.",
    documents: [],
  },
  {
    slug: "perjanjian-kinerja",
    title: "Perjanjian Kinerja",
    description:
      "Perjanjian Kinerja (PK) tahunan antara pimpinan satuan kerja dengan atasan langsung.",
    intro:
      "PK memuat kesepakatan terkait target kinerja dan indikator yang akan dicapai dalam satu tahun anggaran.",
    documents: [],
  },
  {
    slug: "rencana-kinerja",
    title: "Rencana Kinerja",
    description:
      "Rencana Kinerja tahunan sebagai penjabaran program dan kegiatan dalam Renstra.",
    intro:
      "Dokumen rencana kinerja menjadi acuan pelaksanaan program tahunan unit kerja.",
    documents: [],
  },
  {
    slug: "capaian-kinerja",
    title: "Capaian Kinerja",
    description:
      "Laporan capaian kinerja berdasarkan indikator yang telah ditetapkan dalam Perjanjian Kinerja.",
    intro:
      "Capaian kinerja menjadi bahan evaluasi dan perbaikan berkelanjutan pada tahun berikutnya.",
    documents: [],
  },
  {
    slug: "laporan-kinerja",
    title: "Laporan Kinerja (LKj)",
    description:
      "Laporan Kinerja tahunan yang memuat pertanggungjawaban kinerja instansi pemerintah.",
    intro:
      "LKj disusun sesuai PermenPAN-RB Nomor 53 Tahun 2014 sebagai bentuk akuntabilitas kinerja.",
    documents: [],
  },
  {
    slug: "rencana-kerja-tahunan",
    title: "Rencana Kerja Tahunan (RKT)",
    description:
      "Rencana Kerja Tahunan yang memuat program, kegiatan, dan anggaran tahun berjalan.",
    intro:
      "RKT menjadi penjabaran tahunan dari Renstra dan menjadi dasar penyusunan RKA-KL.",
    documents: [],
  },
];

export function getLaporanBySlug(slug) {
  return laporanCategories.find((item) => item.slug === slug) || null;
}
