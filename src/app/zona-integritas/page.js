import Link from "next/link";
import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Zona Integritas",
  description:
    "Informasi pembangunan Zona Integritas menuju WBK/WBBM di lingkungan Kementerian Agama Kabupaten Barito Utara.",
};

const pillars = [
  {
    title: "Manajemen Perubahan",
    description:
      "Penguatan budaya kerja, komitmen pimpinan, dan pembentukan agen perubahan sebagai motor transformasi birokrasi.",
  },
  {
    title: "Penataan Tatalaksana",
    description:
      "Penyederhanaan SOP, digitalisasi layanan, dan keterbukaan informasi publik agar proses kerja lebih efisien.",
  },
  {
    title: "Penataan Sistem Manajemen SDM",
    description:
      "Peningkatan kompetensi pegawai, pengelolaan kinerja yang objektif, dan penempatan SDM sesuai kebutuhan.",
  },
  {
    title: "Penguatan Akuntabilitas",
    description:
      "Pengukuran kinerja berbasis hasil dan tindak lanjut evaluasi untuk memastikan sasaran strategis tercapai.",
  },
  {
    title: "Penguatan Pengawasan",
    description:
      "Pengendalian gratifikasi, penanganan benturan kepentingan, serta pengelolaan pengaduan secara transparan.",
  },
  {
    title: "Peningkatan Kualitas Pelayanan Publik",
    description:
      "Standar pelayanan yang jelas, budaya pelayanan prima, dan inovasi berbasis kebutuhan masyarakat.",
  },
];

const subMenus = [
  {
    title: "Area Perubahan ZI",
    description:
      "Rincian enam area perubahan Zona Integritas dan rencana aksi pada setiap area.",
    href: "/zona-integritas/area-perubahan-zi",
  },
  {
    title: "Video Pembangunan ZI",
    description:
      "Dokumentasi video kegiatan, sosialisasi, dan capaian pembangunan Zona Integritas.",
    href: "/zona-integritas/video-pembangunan-zi",
  },
  {
    title: "Berita Zona Integritas",
    description:
      "Kumpulan publikasi terbaru terkait pembangunan Zona Integritas di lingkungan kantor.",
    href: "/zona-integritas/berita-zona-integritas",
  },
];

export default function ZonaIntegritasPage() {
  return (
    <>
      <PageBanner
        title="Zona Integritas"
        description="Komitmen Kementerian Agama Kabupaten Barito Utara menuju Wilayah Bebas dari Korupsi (WBK) dan Wilayah Birokrasi Bersih Melayani (WBBM)."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Zona Integritas" },
        ]}
      />

      <section className="w-full px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-300">
              Pembangunan ZI
            </span>

            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-50 md:text-3xl">
              Birokrasi Bersih, Profesional, dan Melayani
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              Zona Integritas adalah predikat yang diberikan kepada unit kerja
              yang pimpinan dan jajarannya memiliki komitmen untuk mewujudkan
              WBK dan WBBM. Di Kantor Kementerian Agama Kabupaten Barito Utara,
              pembangunan ZI dilakukan melalui enam area perubahan yang saling
              menguatkan.
            </p>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              Masyarakat dapat memantau capaian, memberikan masukan, dan
              melaporkan keluhan layanan melalui kanal resmi yang tersedia.
              Partisipasi publik menjadi bagian penting untuk menjaga kualitas
              pelayanan tetap terukur dan akuntabel.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/layanan/pengaduan"
                className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Sampaikan Pengaduan
              </Link>
              <Link
                href="/kontak"
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                Hubungi Tim ZI
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {subMenus.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                  Menu ZI
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 group-hover:gap-2 dark:text-emerald-300">
                  Lihat detail <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 dark:bg-slate-950/40">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Enam Area Perubahan
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">
              Pilar Pembangunan Zona Integritas
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
              Enam area perubahan disusun sebagai peta jalan reformasi
              birokrasi. Setiap area memiliki indikator, target, dan bukti
              dukung yang terverifikasi setiap tahun.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-50">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
