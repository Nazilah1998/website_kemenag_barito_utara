import Link from "next/link";
import Image from "next/image";
import { siteInfo } from "../data/site";
import { getLatestBerita } from "../lib/berita";
import { toCoverPreviewUrl } from "../lib/cover-image";

export const dynamic = "force-dynamic";

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

function getBeritaCover(item) {
  return toCoverPreviewUrl(item?.coverImage || "") || "/kemenag.svg";
}

export default async function HomePage() {
  const latestBerita = await getLatestBerita(3);

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

      <section className="theme-section-contrast py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-400">
                Layanan Unggulan
              </p>
              <h2 className="mt-3 max-w-2xl text-2xl font-black lg:text-3xl">
                Pelayanan utama yang paling sering dibutuhkan masyarakat
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Informasi layanan disusun lebih sederhana agar mudah dipahami
                dan nyaman diakses dari berbagai perangkat.
              </p>
            </div>

            <Link
              href="/layanan"
              className="w-fit rounded-full border border-white/20 px-5 py-2.5 text-sm font-black text-white transition hover:bg-white/10"
            >
              Semua Layanan
            </Link>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {featuredServices.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="theme-section-contrast-card group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-emerald-400/40"
              >
                <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                  {item.tag}
                </span>

                <h3 className="mt-4 text-xl font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.desc}
                </p>

                <p className="mt-5 text-sm font-black text-emerald-300">
                  Lihat detail <ArrowIcon />
                </p>
              </Link>
            ))}
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
            {latestBerita.map((item) => (
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
                      className={
                        item.coverImage
                          ? "object-cover transition duration-500 group-hover:scale-105"
                          : "object-contain p-10 transition duration-500 group-hover:scale-105"
                      }
                      unoptimized
                    />

                    <div className="absolute inset-0 [background:var(--news-overlay)]" />

                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-black text-emerald-700 shadow-sm dark:bg-slate-900/90 dark:text-emerald-300">
                      {item.category}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-bold text-white/80">
                        {item.date}
                      </p>
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

                    <span className="mt-5 inline-block text-sm font-black text-emerald-700 dark:text-emerald-300">
                      Baca selengkapnya <ArrowIcon />
                    </span>
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
    </main>
  );
}
