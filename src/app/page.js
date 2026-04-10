import Link from "next/link";
import SectionHeading from "../components/SectionHeading";
import AnnouncementsSection from "../components/AnnouncementsSection";
import { getLatestBerita } from "../lib/berita";
import { serviceHighlights } from "../data/services";
import {
  homeQuickLinks,
  publicInfoCards,
  siteInfo,
  siteLinks,
} from "../data/site";

const heroStats = [
  { label: "Layanan Publik", value: "24+" },
  { label: "Publikasi Aktif", value: "120+" },
  { label: "Informasi Resmi", value: "100%" },
];

export const dynamic = "force-dynamic";
export default async function HomePage() {
  const latestBerita = await getLatestBerita(3);

  return (
    <main id="main-content">
      <section className="border-b border-slate-200 bg-linear-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white dark:border-slate-800">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
              Portal Resmi Pelayanan dan Informasi
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              Website resmi {siteInfo.shortName} yang lebih rapi, responsif, dan
              mudah dipakai.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Media informasi digital untuk menyampaikan berita, pengumuman,
              layanan publik, agenda, dan dokumentasi resmi secara cepat, jelas,
              dan mudah diakses masyarakat.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/berita"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                Lihat Berita
              </Link>

              <Link
                href="/layanan"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Akses Layanan
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h2 className="text-xl font-bold">Informasi Publik</h2>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Menyediakan berita, pengumuman, agenda, dan dokumen resmi secara
                terbuka.
              </p>
            </div>

            <div className="grid gap-4 sm:col-span-3 sm:grid-cols-3 lg:grid-cols-3">
              {heroStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur"
                >
                  <p className="text-3xl font-bold">{item.value}</p>
                  <p className="mt-2 text-sm text-white/80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Akses Cepat"
          title="Masuk ke kebutuhan utama dengan lebih cepat"
          description="Bagian ini dibuat agar pengunjung tidak perlu menelusuri menu terlalu jauh untuk menemukan halaman yang paling sering dibutuhkan."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {homeQuickLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
              <p className="mt-5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Buka halaman →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Layanan Unggulan"
            title="Beberapa layanan utama yang paling sering dicari"
            description="Isi halaman layanan kini dibuat lebih mudah dipahami, terutama untuk pengunjung yang membuka website dari perangkat mobile."
            actionLabel="Semua Layanan"
            actionHref="/layanan"
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {serviceHighlights.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:border-emerald-300 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-500/40 dark:hover:bg-slate-900"
              >
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {item.category}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Berita Terbaru"
          title="Ikuti pembaruan kegiatan dan informasi terkini"
          description="Bagian berita dibuat lebih rapi agar pengunjung bisa membaca ringkasan, kategori, dan masuk ke detail berita dengan lebih nyaman."
          actionLabel="Lihat Semua Berita"
          actionHref="/berita"
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {latestBerita.map((item) => (
            <article
              key={item.slug}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.date} ·{" "}
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  {item.category}
                </span>
              </p>

              <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.excerpt}
              </p>

              <Link
                href={`/berita/${item.slug}`}
                className="mt-5 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Baca selengkapnya →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Informasi Publik"
            title="Struktur informasi dibuat lebih sederhana dan mudah dipahami"
            description="Ini membantu pengunjung baru mengenali fungsi website tanpa perlu membaca terlalu banyak sejak awal."
            align="center"
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {publicInfoCards.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-4xl bg-linear-to-r from-emerald-700 to-emerald-900 p-8 text-white shadow-sm md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
              Hubungi Kami
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Butuh informasi lebih lanjut atau ingin datang langsung ke kantor?
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/80 md:text-base">
              Gunakan halaman kontak untuk menemukan WhatsApp resmi, telepon,
              email, dan lokasi kantor secara lebih cepat.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Buka Halaman Kontak
            </Link>
            <a
              href={siteLinks.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
