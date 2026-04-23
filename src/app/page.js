import Link from "next/link";
import Image from "next/image";
import { siteInfo } from "../data/site";
import { getLatestBeritaHome } from "../lib/berita-home";
import { toCoverPreviewUrl } from "../lib/cover-image";
import ApaKataMerekaSection from "../components/ApaKataMerekaSection";
import HomepageSlidesSection from "../components/HomepageSlidesSection";
import { getPublicHomepageSlides } from "../lib/homepage-slides";

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
    icon: "building",
  },
  {
    tag: "Pengaduan",
    title: "Layanan Pengaduan",
    desc: "Sampaikan aspirasi, masukan, dan pengaduan layanan secara resmi.",
    href: "/layanan/pengaduan",
    icon: "megaphone",
  },
  {
    tag: "ZI",
    title: "Zona Integritas",
    desc: "Komitmen menuju birokrasi bersih, transparan, dan melayani.",
    href: "/zona-integritas",
    icon: "shield",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

function BuildingIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MegaphoneIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 8a3 3 0 0 1 0 6M4 9v6h3l5 5V4L7 9H4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const serviceIcons = {
  building: BuildingIcon,
  megaphone: MegaphoneIcon,
  shield: ShieldIcon,
};

function formatViewCount(value) {
  const total = Number(value || 0);
  return new Intl.NumberFormat("id-ID").format(total);
}

function getBeritaCover(item) {
  return toCoverPreviewUrl(item?.coverImage || "") || "/kemenag.svg";
}

function SectionDivider() {
  return (
    <div className="py-4" aria-hidden="true">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="relative h-10">
          <div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.35) 16%, rgba(148,163,184,0.55) 50%, rgba(16,185,129,0.35) 84%, transparent 100%)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-3 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/30 blur-xl dark:bg-emerald-300/15" />
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [latestBerita, homepageSlides] = await Promise.all([
    getLatestBeritaHome(),
    getPublicHomepageSlides(),
  ]);

  return (
    <main className="theme-page min-h-screen">
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Full Width with Kantor Image Background */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="theme-hero-shell relative overflow-hidden">
        {/* Kantor image background */}
        <div className="absolute inset-0">
          <Image
            src="/kantor-kemenag.jpg"
            alt="Kantor Kementerian Agama Kabupaten Barito Utara"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
            priority
          />
        </div>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-emerald-950/80 to-slate-900/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.20),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.10),transparent_24%)]" />

        {/* Decorative floating orbs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-float" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-yellow-500/8 blur-3xl animate-float animate-delay-300" />

        <div className="relative w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-24 xl:px-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left - Content */}
            <div className="animate-slide-in-left">
              <div className="glass inline-flex rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-emerald-300">
                Portal Resmi Kemenag Barito Utara
              </div>

              <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.12] tracking-tight text-white md:text-5xl lg:text-6xl">
                Layanan dan Informasi{" "}
                <span className="relative">
                  Keagamaan
                  <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-emerald-400/50" />
                </span>{" "}
                dalam Satu Portal Resmi.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Website resmi Kementerian Agama Kabupaten Barito Utara sebagai
                pusat informasi publik, berita, layanan, dan publikasi
                kelembagaan yang mudah diakses masyarakat.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://ptsp-kemenag-baritoutara.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-primary-button group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-black transition"
                >
                  Akses Layanan PTSP
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>

                <Link
                  href="/berita"
                  className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Lihat Berita
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["24+", "Layanan Publik"],
                  ["120+", "Publikasi Aktif"],
                  ["100%", "Informasi Resmi"],
                ].map(([number, label], index) => (
                  <div
                    key={label}
                    className={`glass rounded-2xl p-5 animate-fade-in-up animate-delay-${(index + 1) * 100}`}
                  >
                    <p className="text-3xl font-black text-white">{number}</p>
                    <p className="mt-1 text-xs font-bold tracking-wide text-emerald-300">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Card Panel */}
            <div className="relative animate-slide-in-right">
              <div className="absolute -inset-4 rounded-[2rem] bg-white/6 blur-2xl" />

              <div className="theme-hero-panel relative overflow-hidden rounded-[2rem] p-6 shadow-2xl">
                <div className="theme-hero-card rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="theme-accent-soft flex h-16 w-16 items-center justify-center rounded-2xl border p-3">
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

                  <div className="mt-5 rounded-2xl bg-(--primary-soft) p-5">
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
                    <div className="rounded-2xl bg-(--surface-soft) p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">
                        Status Portal
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <p className="text-xl font-black">Aktif</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-(--surface-soft) p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-300">
                        Akses Publik
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <p className="text-xl font-black">Terbuka</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-8 lg:pt-10">
        <SectionDivider />
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* BERITA SECTION — Full Width Modern Cards           */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700 dark:text-emerald-300">
              Berita Terbaru
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight lg:text-4xl">
              Ikuti pembaruan kegiatan dan informasi terkini
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Berita resmi dari Kementerian Agama Kabupaten Barito Utara untuk
              masyarakat.
            </p>
          </div>

          <Link
            href="/berita"
            className="theme-outline-button group inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition"
          >
            Lihat Semua Berita
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {latestBerita.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestBerita.map((item, index) => (
              <article
                key={item.slug}
                className={`theme-news-card group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up animate-delay-${(index + 1) * 100}`}
              >
                <Link href={`/berita/${item.slug}`} className="block h-full">
                  <div className="relative h-48 overflow-hidden bg-(--surface-muted)">
                    <Image
                      src={getBeritaCover(item)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      quality={index === 0 ? 75 : 70}
                      decoding="async"
                      className={
                        item.coverImage
                          ? "object-cover transition-transform duration-700 group-hover:scale-110"
                          : "object-contain p-10 transition-transform duration-700 group-hover:scale-110"
                      }
                    />

                    <div className="absolute inset-0 [background:var(--news-overlay)]" />

                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-emerald-700 shadow-sm dark:bg-slate-900/90 dark:text-emerald-300">
                      {item.category}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-white/80">
                        <span>{item.date}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/30 px-2 py-0.5 text-[10px] font-black text-white backdrop-blur-sm">
                          <EyeIcon className="h-3 w-3" />
                          {formatViewCount(item.viewCount)}x
                        </span>
                      </div>

                      <h3 className="mt-1.5 line-clamp-2 text-sm font-black leading-snug text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="theme-text-muted line-clamp-2 text-sm leading-6">
                      {item.excerpt ||
                        "Klik untuk membaca berita selengkapnya."}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <EyeIcon className="h-3.5 w-3.5" />
                        {formatViewCount(item.viewCount)}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 transition-colors group-hover:text-emerald-600 dark:text-emerald-300">
                        Baca
                        <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="theme-news-empty mt-10 rounded-2xl p-10 text-center">
            <h3 className="text-xl font-black">Belum ada berita terbaru</h3>
            <p className="theme-text-muted mt-3 text-sm leading-7">
              Berita yang sudah dipublikasikan akan tampil otomatis di bagian
              ini.
            </p>
          </div>
        )}
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════════════ */}
      {/* LAYANAN SECTION — Full Width Modern Service Cards  */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-700 dark:text-emerald-300">
                Layanan Unggulan
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight lg:text-4xl">
                Pelayanan utama yang paling sering dibutuhkan masyarakat
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                Informasi layanan disusun lebih sederhana agar mudah dipahami
                dan nyaman diakses dari berbagai perangkat.
              </p>
            </div>

            <Link
              href="/layanan"
              className="theme-outline-button group inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition"
            >
              Semua Layanan
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredServices.map((item) => {
              const IconComponent = serviceIcons[item.icon] || BuildingIcon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="theme-news-card group relative overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400/40 hover:shadow-2xl"
                >
                  {/* Decorative gradient blob */}
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-500/5 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/10 group-hover:blur-3xl" />

                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 transition-colors group-hover:bg-emerald-500/15 dark:text-emerald-300">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-black">{item.title}</h3>

                    <p className="theme-text-muted mt-3 text-sm leading-7">
                      {item.desc}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-black text-emerald-700 transition-colors group-hover:text-emerald-600 dark:text-emerald-300">
                      <span>Lihat detail</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section Baru: Apa Kata Mereka */}
      <ApaKataMerekaSection />

      <SectionDivider />

      <HomepageSlidesSection slides={homepageSlides} />
    </main>
  );
}
