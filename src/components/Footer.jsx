import Image from "next/image";
import Link from "next/link";
import { siteInfo, siteLinks } from "@/data/site";

const mainMenu = [
  { label: "Beranda", href: "/" },
  { label: "Profil Instansi", href: "/profil" },
  { label: "Layanan", href: "/layanan" },
  { label: "Kontak", href: "/kontak" },
];

const publicInfoMenu = [
  { label: "Berita", href: "/berita" },
  { label: "Pengumuman", href: "/pengumuman" },
];

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="theme-footer-link text-sm font-semibold transition"
    >
      {children}
    </Link>
  );
}

function FooterInfoItem({ label, value, href }) {
  const renderValue = Array.isArray(value) ? (
    <div className="mt-1 space-y-1">
      {value.map((item, index) => (
        <p key={`${label}-${index}`} className="theme-footer-muted text-sm leading-6">
          {item}
        </p>
      ))}
    </div>
  ) : (
    <p className="theme-footer-muted mt-1 text-sm leading-6">{value}</p>
  );

  const content = (
    <>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
        {label}
      </p>
      {renderValue}
    </>
  );

  if (href) {
    return (
      <a href={href} className="block transition hover:opacity-90">
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-footer relative overflow-hidden border-t">
      <div className="absolute inset-0 opacity-90 [background:radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 p-3 ring-1 ring-white/10">
                <Image
                  src={siteInfo.logoSrc}
                  alt={siteInfo.shortName}
                  width={54}
                  height={54}
                  className="object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.26em] text-emerald-300">
                  {siteInfo.shortName}
                </p>
                <p className="mt-1 text-sm text-white/80">{siteInfo.tagline}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-white/70">
                Portal Resmi Informasi dan Layanan
              </p>
              <p className="theme-footer-muted mt-4 max-w-xl text-sm leading-7">
                Website resmi Kantor Kementerian Agama Kabupaten Barito Utara
                sebagai media informasi publik, publikasi kelembagaan, dan akses
                layanan yang lebih rapi, modern, dan mudah digunakan.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/kontak"
                className="theme-primary-button inline-flex items-center rounded-full px-5 py-2.5 text-sm font-black transition"
              >
                Hubungi Kami
              </Link>

              <Link
                href="/profil"
                className="theme-footer-panel inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/20 hover:text-emerald-300"
              >
                Lihat Profil
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/90">
              Menu Utama
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {mainMenu.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/90">
              Informasi Publik
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {publicInfoMenu.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </div>

            <div className="theme-footer-panel mt-6 rounded-2xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Catatan
              </p>
              <p className="theme-footer-muted mt-2 text-sm leading-6">
                Agenda, Galeri, dan Dokumen Publik sedang dalam proses
                pengembangan.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/90">
              Kontak Resmi
            </p>

            <div className="mt-5 space-y-5">
              <FooterInfoItem
                label="Email"
                value={siteInfo.email}
                href={siteLinks.emailHref}
              />
              <FooterInfoItem
                label="Telepon"
                value={siteInfo.phone}
                href={siteLinks.phoneHref}
              />
              <FooterInfoItem
                label="Jam Layanan"
                value={siteInfo.officeHours}
              />
              <FooterInfoItem
                label="Wilayah"
                value="Kabupaten Barito Utara, Kalimantan Tengah"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
            <p className="theme-footer-muted">
              © {year} {siteInfo.shortName}. Hak Cipta Dilindungi.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="theme-footer-badge-accent inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
                Resmi
              </span>
              <span className="theme-footer-badge inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
                Informasi Publik
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}