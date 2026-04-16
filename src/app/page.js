import Link from "next/link";
import Image from "next/image";
import { siteInfo } from "../data/site";
import { getLatestBeritaHome } from "../lib/berita-home";
import { toCoverPreviewUrl } from "../lib/cover-image";

export const revalidate = 300;

export const metadata = {
  title: "Kementerian Agama Kabupaten Barito Utara",
  description:
    "Website Resmi Kementerian Agama Kabupaten Barito Utara sebagai pusat informasi, layanan publik, berita, dan publikasi kelembagaan.",
};

const featuredServices = [
  {
    tag: "PTSP",
    title: "Pelayanan Terpadu Satu Pintu",
    desc: "Pusat layanan administrasi dan informasi publik secara terpadu.",
    href: "/layanan/ptsp",
  },
  {
    tag: "Pengaduan",
    title: "Layanan Pengaduan",
    desc: "Sampaikan aspirasi, masukan, dan pengaduan layanan secara resmi.",
    href: "/layanan/pengaduan",
  },
  {
    tag: "ZI",
    title: "Zona Integritas",
    desc: "Komitmen menuju birokrasi bersih, transparan, dan melayani.",
    href: "/zona-integritas",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

function EyeIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function formatViewCount(value) {
  const total = Number(value || 0);
  return new Intl.NumberFormat("id-ID").format(total);
}

function getBeritaCover(item) {
  return toCoverPreviewUrl(item?.coverImage || "") || "/kemenag.svg";
}

function SectionDivider() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8"
      aria-hidden="true"
    >
      <div className="relative h-10">
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.18) 18%, rgba(148,163,184,0.35) 50%, rgba(16,185,129,0.18) 82%, transparent 100%)",
          }}
        />
        <div className="absolute left-1/2 top-1/2 h-3 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-xl dark:bg-emerald-300/10" />
      </div>
    </div>
  );
}

export default async function HomePage() {
  const latestBerita = await getLatestBeritaHome();

  return (
    <main className="theme-page min-h-screen">
      <section className="theme-hero-shell relative overflow-hidden">
        <div className="absolute inset-0 [background:var(--hero-gradient)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.24),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.14),transparent_24%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="theme-hero-panel inline-flex rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-[0.32em]">
                Portal Resmi Kemenag Barito Utara
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
                Layanan dan Informasi Keagamaan dalam Satu Portal Resmi.
              </h1>

              <p className="theme-hero-muted mt-6 max-w-2xl text-base leading-8">
                Website resmi Kementerian Agama Kabupaten Barito Utara sebagai
                pusat informasi publik, berita, layanan, dan publikasi
                kelembagaan yang mudah diakses masyarakat.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/layanan"
                  className="theme-primary-button rounded-full px-6 py-3 text-sm font-black transition"
                >
                  Akses Layanan
                </Link>

                <Link
                  href="/berita"
                  className="rounded-full border border-white/18 bg-white/8 px-6 py-3 text-sm font-black text-white transition hover:bg-white/12"
                >
                  Lihat Berita
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["24+", "Layanan Publik"],
                  ["120+", "Publikasi Aktif"],
                  ["100%", "Informasi Resmi"],
                ].map(([number, label]) => (
                  <div
                    key={label}
                    className="theme-hero-metric rounded-3xl p-5"
                  >
                    <p className="text-2xl font-black">{number}</p>
                    <p className="theme-hero-accent mt-1 text-xs font-bold">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-4xl bg-white/8 blur-2xl" />

              <div className="theme-hero-panel relative overflow-hidden rounded-4xl p-5 shadow-2xl">
                <div className="theme-hero-card rounded-3xl p-5 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="theme-accent-soft flex h-16 w-16 items-center justify-center rounded-3xl border p-3">
                      <Image
                        src={siteInfo.logoSrc}
                        alt={siteInfo.shortName}
                        width={52}
                        height={52}
                        className="object-contain"
                        priority
                      />
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300">
                        {siteInfo.shortName}
                      </p>
                      <h2 className="mt-1 text-xl font-black">
                        Melayani Umat dengan Integritas
                      </h2>
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl bg-(--primary-soft) p-5">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
                      Fokus Pelayanan
                    </p>

                    <div className="mt-4 space-y-3">
                      {[
                        "Informasi publik yang terbuka dan mudah diakses.",
                        "Layanan keagamaan yang cepat, ramah, dan profesional.",
                        "Publikasi kegiatan resmi Kemenag Barito Utara.",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                            ✓
                          </span>
                          <p className="theme-text-muted text-sm leading-6">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-(--surface-soft) p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">
                        Status Portal
                      </p>
                      <p className="mt-2 text-xl font-black">Aktif</p>
                    </div>

                    <div className="rounded-3xl bg-(--surface-soft) p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">
                        Akses Publik
                      </p>
                      <p className="mt-2 text-xl font-black">Terbuka</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700 dark:text-emerald-300">
              Berita Terbaru
            </p>

            <h2 className="mt-3 max-w-2xl text-2xl font-black lg:text-3xl">
              Ikuti pembaruan kegiatan dan informasi terkini
            </h2>
          </div>

          <Link
            href="/berita"
            className="theme-outline-button w-fit rounded-full px-5 py-2.5 text-sm font-black transition"
          >
            Lihat Semua Berita
          </Link>
        </div>

        {latestBerita.length > 0 ? (
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {latestBerita.map((item, index) => (
              <article
                key={item.slug}
                className="theme-news-card group overflow-hidden rounded-3xl transition hover:-translate-y-1"
              >
                <Link href={`/berita/${item.slug}`} className="block h-full">
                  <div className="relative h-52 overflow-hidden bg-(--surface-muted)">
                    <Image
                      src={getBeritaCover(item)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      quality={index === 0 ? 75 : 70}
                      decoding="async"
                      className={
                        item.coverImage
                          ? "object-cover transition duration-500 group-hover:scale-105"
                          : "object-contain p-10 transition duration-500 group-hover:scale-105"
                      }
                    />

                    <div className="absolute inset-0 [background:var(--news-overlay)]" />

                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-black text-emerald-700 shadow-sm dark:bg-slate-900/90 dark:text-emerald-300">
                      {item.category}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-white/80">
                        <span>{item.date}</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/30 px-2.5 py-1 text-[11px] font-black text-white backdrop-blur-sm">
                          <EyeIcon className="h-3.5 w-3.5" />
                          {formatViewCount(item.viewCount)}x dilihat
                        </span>
                      </div>

                      <h3 className="mt-2 line-clamp-2 text-lg font-black leading-snug text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="theme-text-muted line-clamp-2 text-sm leading-7">
                      {item.excerpt ||
                        "Klik untuk membaca berita selengkapnya."}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <EyeIcon className="h-4 w-4" />
                        {formatViewCount(item.viewCount)} pembaca
                      </span>

                      <span className="inline-block text-sm font-black text-emerald-700 dark:text-emerald-300">
                        Baca selengkapnya <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="theme-news-empty mt-7 rounded-3xl p-7 text-center">
            <h3 className="text-xl font-black">Belum ada berita terbaru</h3>
            <p className="theme-text-muted mt-3 text-sm leading-7">
              Berita yang sudah dipublikasikan akan tampil otomatis di bagian
              ini.
            </p>
          </div>
        )}
      </section>

      <SectionDivider />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700 dark:text-emerald-300">
                Layanan Unggulan
              </p>

              <h2 className="mt-3 max-w-2xl text-2xl font-black lg:text-3xl">
                Pelayanan utama yang paling sering dibutuhkan masyarakat
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                Informasi layanan disusun lebih sederhana agar mudah dipahami
                dan nyaman diakses dari berbagai perangkat.
              </p>
            </div>

            <Link
              href="/layanan"
              className="theme-outline-button w-fit rounded-full px-5 py-2.5 text-sm font-black transition"
            >
              Semua Layanan
            </Link>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {featuredServices.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="theme-news-card group rounded-3xl border p-6 transition hover:-translate-y-1 hover:border-emerald-400/40"
              >
                <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">
                  {item.tag}
                </span>

                <h3 className="mt-4 text-xl font-black">{item.title}</h3>

                <p className="theme-text-muted mt-3 text-sm leading-7">
                  {item.desc}
                </p>

                <p className="mt-5 text-sm font-black text-emerald-700 dark:text-emerald-300">
                  Lihat detail <ArrowIcon />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
