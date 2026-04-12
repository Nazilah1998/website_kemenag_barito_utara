import Link from "next/link";

export const metadata = {
  title: "Profil | Kementerian Agama Kabupaten Barito Utara",
  description:
    "Profil Kementerian Agama Kabupaten Barito Utara, mencakup sejarah, visi misi, tugas fungsi, nilai budaya kerja, dan tujuan kelembagaan.",
};

const profileMenus = [
  {
    title: "Sejarah",
    description:
      "Mengenal perjalanan dan perkembangan Kementerian Agama Kabupaten Barito Utara.",
    href: "/profil/sejarah",
  },
  {
    title: "Visi & Misi",
    description:
      "Arah, komitmen, dan landasan kerja dalam memberikan pelayanan kepada masyarakat.",
    href: "/profil/visi-misi",
  },
  {
    title: "Tugas dan Fungsi",
    description:
      "Penjelasan tugas pokok dan fungsi kelembagaan dalam penyelenggaraan urusan agama.",
    href: "/profil/tugas-fungsi",
  },
  {
    title: "Nilai Budaya Kerja",
    description:
      "Nilai dasar aparatur dalam membangun pelayanan yang berintegritas dan profesional.",
    href: "/profil/nilai-budaya-kerja",
  },
  {
    title: "Tujuan",
    description:
      "Tujuan strategis dalam meningkatkan kualitas layanan keagamaan dan tata kelola organisasi.",
    href: "/profil/tujuan",
  },
];

export default function ProfilPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-800 to-teal-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-200">
              Profil Instansi
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
              Kementerian Agama Kabupaten Barito Utara
            </h1>

            <p className="mt-6 text-base leading-8 text-emerald-50 md:text-lg">
              Hadir sebagai lembaga pelayanan publik di bidang keagamaan yang
              berkomitmen memberikan layanan terbaik, memperkuat kerukunan umat,
              serta membangun tata kelola yang bersih, profesional, dan
              berintegritas.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
              Tentang Kami
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-950">
              Pelayanan Keagamaan yang Responsif dan Terpercaya
            </h2>

            <p className="mt-5 text-sm leading-8 text-slate-600">
              Kementerian Agama Kabupaten Barito Utara menjalankan fungsi
              pelayanan, pembinaan, dan penguatan kehidupan beragama di
              masyarakat. Melalui peningkatan kualitas layanan, transformasi
              digital, dan tata kelola yang akuntabel, Kemenag Barito Utara
              terus berupaya menghadirkan pelayanan yang mudah, cepat, ramah,
              dan berdampak.
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-600">
              Profil ini memuat informasi utama mengenai sejarah, visi dan misi,
              tugas dan fungsi, nilai budaya kerja, serta tujuan kelembagaan
              sebagai dasar dalam memahami arah pelayanan Kemenag Barito Utara.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {profileMenus.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-800">
                  {index + 1}
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950 group-hover:text-emerald-700">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-5 text-sm font-bold text-emerald-700">
                  Lihat selengkapnya →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
