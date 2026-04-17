import Link from "next/link";
import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Survey Kepuasan Masyarakat",
  description:
    "Sampaikan penilaian, saran, dan masukan Anda melalui survey kepuasan masyarakat Kementerian Agama Kabupaten Barito Utara.",
};

const surveyChannels = [
  {
    title: "Survey Kepuasan Masyarakat (SKM)",
    description:
      "Pengukuran kualitas pelayanan publik berdasarkan Peraturan Menteri PANRB Nomor 14 Tahun 2017.",
    href: "https://bit.ly/skm-kemenag-barut",
    badge: "SKM",
  },
  {
    title: "Survey Persepsi Anti Korupsi (SPAK)",
    description:
      "Pengukuran persepsi masyarakat terhadap integritas dan pencegahan korupsi pada unit pelayanan.",
    href: "https://bit.ly/spak-kemenag-barut",
    badge: "SPAK",
  },
  {
    title: "Survey Pelayanan PTSP",
    description:
      "Penilaian khusus untuk layanan satu pintu (PTSP) di kantor Kemenag Barito Utara.",
    href: "https://bit.ly/ptsp-kemenag-barut",
    badge: "PTSP",
  },
];

export default function SurveyPage() {
  return (
    <>
      <PageBanner
        title="Survey Kepuasan Masyarakat"
        description="Pendapat Anda membantu kami meningkatkan kualitas layanan publik."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Survey" },
        ]}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Tentang Survey Kami
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <p>
                Kementerian Agama Kabupaten Barito Utara berkomitmen memberikan
                pelayanan publik yang cepat, mudah, dan bebas pungutan.
                Masukan dari Anda menjadi dasar perbaikan berkelanjutan.
              </p>
              <p>
                Seluruh jawaban bersifat anonim dan tidak memengaruhi status
                layanan Anda. Setiap survey rata-rata membutuhkan waktu 3-5
                menit untuk diselesaikan.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Pilih Survey yang Ingin Diisi
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {surveyChannels.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
                >
                  <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {item.badge}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Isi Survey
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Laporan Hasil Survey
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Ringkasan hasil survey dan tindak lanjut perbaikan akan
              dipublikasikan secara berkala pada halaman ini.
            </p>
            <Link
              href="/laporan/capaian-kinerja"
              className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Lihat Capaian Kinerja →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
