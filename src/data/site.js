export function buildWhatsAppLink(number, message = "") {
  const normalized = String(number || "").replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${text}`;
}

const mapQuery = "Kementerian Agama Kabupaten Barito Utara";

export const siteInfo = {
  name: "Kementerian Agama Kabupaten Barito Utara",
  shortName: "KEMENAG BARITO UTARA",
  tagline: "Melayani Umat dengan Integritas dan Profesionalitas",
  description:
    "Kementerian Agama Kabupaten Barito Utara menyediakan informasi, publikasi kegiatan, pengumuman, agenda, dan akses layanan digital secara terpadu.",
  email: "kepegawaiankemenagbarut@gmail.com",
  phone: "(0519) 21269",
  phoneRaw: "051921269",
  whatsapp: "+62 812-0000-0000",
  whatsappRaw: "6281200000000",
  officeHours: [
    "Senin - Kamis, 07.30 - 16.00 WIB",
    "Jum'at, 07.30 - 16.30 WIB",
  ],
  address: "Jl. Ahmad Yani No.126 Muara Teweh 73811",
  complaintHref: "/kontak",
  logoSrc: "/kemenag.svg",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://kemenag-baritoutara.vercel.app",
};

export const siteLinks = {
  emailHref: `mailto:${siteInfo.email}`,
  phoneHref: `tel:${siteInfo.phoneRaw}`,
  whatsappHref: buildWhatsAppLink(
    siteInfo.whatsappRaw,
    "Assalamu’alaikum, saya ingin menanyakan informasi layanan di Kemenag Barito Utara.",
  ),
  mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`,
  mapDirectionUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
};

export const footerMenuLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Berita", href: "/berita" },
  { label: "Layanan", href: "/layanan" },
  { label: "Kontak", href: "/kontak" },
];

export const homeQuickLinks = [
  {
    title: "Berita Terbaru",
    description: "Ikuti publikasi kegiatan dan informasi terbaru dari kantor.",
    href: "/berita",
  },
  {
    title: "Layanan Publik",
    description: "Lihat jenis layanan, persyaratan, dan alur yang tersedia.",
    href: "/layanan",
  },
  {
    title: "Dokumen Publik",
    description:
      "Akses dokumen, informasi terbuka, dan kebutuhan publik lainnya.",
    href: "/informasi",
  },
  {
    title: "Hubungi Kami",
    description: "Temukan WhatsApp, telepon, email, dan lokasi kantor.",
    href: "/kontak",
  },
];

export const publicInfoCards = [
  {
    title: "Informasi Terbuka",
    description:
      "Website ini disusun untuk membantu masyarakat memperoleh informasi secara cepat, jelas, dan tertata.",
  },
  {
    title: "Layanan yang Mudah Diakses",
    description:
      "Tiap halaman dirancang lebih ringan, responsif, dan mudah digunakan di perangkat mobile.",
  },
  {
    title: "Komunikasi Lebih Cepat",
    description:
      "Kanal kontak seperti WhatsApp, telepon, dan halaman kontak kini dibuat lebih menonjol dan mudah dijangkau.",
  },
];

export const quickContactActions = [
  {
    title: "Chat WhatsApp Kantor",
    description:
      "Jalur tercepat untuk pertanyaan umum, konfirmasi informasi, dan arahan layanan.",
    href: siteLinks.whatsappHref,
    badge: "WhatsApp",
    external: true,
  },
  {
    title: "Telepon Kantor",
    description:
      "Cocok untuk kebutuhan yang perlu respons langsung pada jam layanan kantor.",
    href: siteLinks.phoneHref,
    badge: "Telepon",
    external: false,
  },
  {
    title: "Kirim Email Resmi",
    description:
      "Gunakan email untuk komunikasi formal, permintaan informasi, dan detail tertulis.",
    href: `${siteLinks.emailHref}?subject=Permohonan%20Informasi`,
    badge: "Email",
    external: false,
  },
  {
    title: "Buka Peta Lokasi",
    description:
      "Lihat lokasi kantor dan gunakan petunjuk arah agar pengunjung lebih mudah datang langsung.",
    href: siteLinks.mapDirectionUrl,
    badge: "Maps",
    external: true,
  },
];

export const contactUnits = [
  {
    title: "Pelayanan Umum & PTSP",
    description:
      "Untuk pertanyaan umum, surat masuk, konsultasi awal, dan arahan ke bidang terkait.",
    prompt:
      "Assalamu’alaikum, saya ingin menanyakan layanan umum/PTSP di Kemenag Barito Utara.",
  },
  {
    title: "Humas & Informasi Publik",
    description:
      "Untuk publikasi kegiatan, permintaan informasi publik, media, dan dokumentasi.",
    prompt:
      "Assalamu’alaikum, saya ingin menghubungi bagian Humas & Informasi Publik di Kemenag Barito Utara.",
  },
  {
    title: "Pendidikan Madrasah",
    description:
      "Untuk koordinasi atau pertanyaan umum terkait madrasah dan layanan yang relevan.",
    prompt:
      "Assalamu’alaikum, saya ingin menanyakan informasi terkait Pendidikan Madrasah di Kemenag Barito Utara.",
  },
  {
    title: "Bimas Islam / KUA",
    description:
      "Untuk informasi keagamaan, koordinasi umum KUA, dan kebutuhan konsultasi dasar.",
    prompt:
      "Assalamu’alaikum, saya ingin menanyakan informasi terkait Bimas Islam / KUA di Kemenag Barito Utara.",
  },
];

export const contactFaq = [
  {
    question: "Apakah saya bisa bertanya lewat WhatsApp?",
    answer:
      "Bisa. Gunakan tombol WhatsApp resmi pada halaman kontak agar pertanyaan masuk ke kanal resmi kantor.",
  },
  {
    question: "Apakah layanan tatap muka hanya di hari kerja?",
    answer:
      "Ya. Layanan tatap muka mengikuti jam kerja kantor pada hari Senin sampai Jumat.",
  },
  {
    question: "Bagaimana cara menuju kantor?",
    answer:
      "Gunakan tombol Buka Peta atau Petunjuk Arah untuk membuka lokasi kantor di Google Maps.",
  },
  {
    question: "Kalau saya belum tahu harus menghubungi unit mana?",
    answer:
      "Pilih Pelayanan Umum & PTSP atau gunakan form pesan. Petugas akan membantu mengarahkan ke bagian yang sesuai.",
  },
];
