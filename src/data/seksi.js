export const dataSeksi = [
  {
    slug: "sekjen",
    judul: "Sub Bagian Tata Usaha",
    nama_kepala: "SONY ANWARI HUSNI, S.Pd.I",
    nip_kepala: "197809042007101005",
    foto_kepala: null, // Will use a placeholder if null
    deskripsi:
      "Subbagian Tata Usaha mempunyai tugas melakukan koordinasi penyusunan rencana, evaluasi, laporan dan kehumasan, urusan keuangan, perbendaharaan, akuntansi, dan pelaporan keuangan, serta urusan organisasi, tata laksana, kepegawaian, hukum, kerukunan umat beragama, dan dukungan administrasi bagi seluruh satuan organisasi di lingkungan Kantor Kementerian Agama Kabupaten Barito Utara.",
    pegawai: [
      {
        nama: "MUHAMMAD NAZILAH, S.E",
        nip: "199809202023211007",
        jabatan: "Analis Sumber Daya Manusia Aparatur Ahli Pertama",
        foto: null,
      },
      {
        nama: "EKA BAGUS PURNOMO, S.Pd",
        nip: "199308282025211014",
        jabatan: "Penata Layanan Operasional",
        foto: null,
      },
      {
        nama: "YOSUANDI, S.IP",
        nip: "199508092020121004",
        jabatan: "Arsiparis Ahli Pertama",
        foto: null,
      },
      {
        nama: "HERLINDA, SE",
        nip: "197206282006042007",
        jabatan: "Pranata Keuangan APBN Penyelia",
        foto: null,
      },
      {
        nama: "WAHYUDI FAJAR PERSADA, S.Kom",
        nip: "199407052023211020",
        jabatan: "Pranata Komputer Ahli Pertama",
        foto: null,
      },
    ],
  },
  {
    slug: "seksi-bimas-islam",
    judul: "Seksi Bimbingan Masyarakat Islam",
    nama_kepala: "Almubasir, S.Pd.I",
    nip_kepala: "-",
    foto_kepala: null,
    deskripsi:
      "Seksi Bimbingan Masyarakat Islam mempunyai tugas melakukan pelayanan, bimbingan teknis, pembinaan, serta pengelolaan data dan informasi di bidang bimbingan masyarakat Islam.",
    pegawai: [],
  },
  {
    slug: "seksi-pendidikan-agama-islam",
    judul: "Seksi Pendidikan Agama Islam",
    nama_kepala: "H. Bakti Tawaddin, M.Pd",
    nip_kepala: "-",
    foto_kepala: null,
    deskripsi:
      "Seksi Pendidikan Agama Islam mempunyai tugas melakukan pelayanan, bimbingan teknis, pembinaan, serta pengelolaan data dan informasi di bidang pendidikan agama Islam pada sekolah umum.",
    pegawai: [],
  },
  {
    slug: "seksi-pendidikan-diniyah-dan-pondok-pesantren",
    judul: "Seksi Pendidikan Diniyah dan Pondok Pesantren",
    nama_kepala: "Supian, SE",
    nip_kepala: "-",
    foto_kepala: null,
    deskripsi:
      "Seksi Pendidikan Diniyah dan Pondok Pesantren mempunyai tugas melakukan pelayanan, bimbingan teknis, pembinaan, serta pengelolaan data dan informasi di bidang pendidikan diniyah dan pondok pesantren.",
    pegawai: [],
  },
  {
    slug: "seksi-pendidikan-madrasah",
    judul: "Seksi Pendidikan Madrasah",
    nama_kepala: "Handayani, S.Pd.I",
    nip_kepala: "-",
    foto_kepala: null,
    deskripsi:
      "Seksi Pendidikan Madrasah mempunyai tugas melakukan pelayanan, bimbingan teknis, pembinaan, serta pengelolaan data dan informasi di bidang pendidikan madrasah.",
    pegawai: [],
  },
  {
    slug: "penyelenggara-hindu",
    judul: "Penyelenggara Hindu",
    nama_kepala: "Wandi, SH.AH",
    nip_kepala: "-",
    foto_kepala: null,
    deskripsi:
      "Penyelenggara Hindu mempunyai tugas melakukan pelayanan, bimbingan teknis, pembinaan, serta pengelolaan data dan informasi di bidang bimbingan masyarakat Hindu.",
    pegawai: [],
  },
  {
    slug: "penyelenggara-zakat-wakaf",
    judul: "Penyelenggara Zakat dan Wakaf",
    nama_kepala: "Hasan Fauzi, S.Ag",
    nip_kepala: "-",
    foto_kepala: null,
    deskripsi:
      "Penyelenggara Zakat dan Wakaf mempunyai tugas melakukan pelayanan, bimbingan teknis, pembinaan, serta pengelolaan data dan informasi di bidang zakat dan wakaf.",
    pegawai: [],
  },
  {
    slug: "kua-kantor-urusan-agama",
    judul: "Kantor Urusan Agama (KUA)",
    nama_kepala: "Kepala KUA Kecamatan",
    nip_kepala: "-",
    foto_kepala: null,
    deskripsi:
      "Kantor Urusan Agama mempunyai tugas melaksanakan sebagian tugas Kantor Kementerian Agama Kabupaten di bidang urusan agama Islam dalam wilayah kecamatan.",
    pegawai: [],
  },
];

export function getSeksiBySlug(slug) {
  return dataSeksi.find((seksi) => seksi.slug === slug);
}
