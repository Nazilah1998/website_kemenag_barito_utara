import Image from "next/image";
import Link from "next/link";
import { siteInfo, siteLinks } from "@/data/site";

const mainMenu = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Berita", href: "/berita" },
  { label: "Layanan", href: "/layanan" },
  { label: "Informasi", href: "/informasi" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: FacebookIcon,
  },
  {
    label: "X / Twitter",
    href: "#",
    icon: XIcon,
  },
  {
    label: "Instagram",
    href: "#",
    icon: InstagramIcon,
  },
  {
    label: "YouTube",
    href: "#",
    icon: YouTubeIcon,
  },
  {
    label: "TikTok",
    href: "#",
    icon: TikTokIcon,
  },
];

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="theme-footer-link text-sm font-semibold transition hover:translate-x-0.5"
    >
      {children}
    </Link>
  );
}

function FooterInfoItem({ label, value, href }) {
  const renderValue = Array.isArray(value) ? (
    <div className="mt-1 space-y-1">
      {value.map((item, index) => (
        <p
          key={`${label}-${index}`}
          className="theme-footer-muted text-sm leading-6"
        >
          {item}
        </p>
      ))}
    </div>
  ) : (
    <p className="theme-footer-muted mt-1 text-sm leading-6">{value}</p>
  );

  const content = (
    <>
      <p
        className="text-xs font-black uppercase tracking-[0.2em]"
        style={{ color: "var(--footer-fg)" }}
      >
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

function SocialIconLink({ label, href, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="theme-footer-panel inline-flex h-10 w-10 items-center justify-center rounded-full text-(--footer-muted) transition hover:-translate-y-0.5 hover:text-(--primary-strong)"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-footer relative overflow-hidden border-t">
      <div className="absolute inset-0 [background:radial-gradient(circle_at_top_left,rgba(16,185,129,0.1),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.04),transparent_24%)] dark:[background:radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_24%)]" />

      <div className="relative w-full px-6 py-8 sm:px-10 lg:px-16 xl:px-20">
        {/* Top: Brand + Nav + Contact + Social in horizontal layout */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.6fr_1fr_0.8fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="theme-footer-panel flex h-12 w-12 items-center justify-center rounded-2xl p-2">
                <Image
                  src={siteInfo.logoSrc}
                  alt={siteInfo.shortName}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-(--primary-strong)">
                  {siteInfo.shortName}
                </p>
                <p className="theme-footer-muted text-xs">
                  {siteInfo.tagline}
                </p>
              </div>
            </div>

            <p className="theme-footer-muted mt-4 max-w-md text-sm leading-6">
              Portal resmi informasi publik, layanan, dan publikasi kelembagaan Kemenag Barito Utara.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/kontak"
                className="theme-primary-button inline-flex items-center rounded-full px-4 py-2 text-xs font-black transition"
              >
                Hubungi Kami
              </Link>

              <Link
                href="/profil"
                className="theme-footer-panel inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:text-(--primary-strong)"
                style={{ color: "var(--footer-fg)" }}
              >
                Lihat Profil
              </Link>
            </div>
          </div>

          {/* Menu */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--footer-fg)" }}
            >
              Menu Utama
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2">
              {mainMenu.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--footer-fg)" }}
            >
              Kontak Resmi
            </p>

            <div className="mt-3 space-y-3">
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

          {/* Social */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--footer-fg)" }}
            >
              Ikuti Kami
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {socialLinks.map((item) => (
                <SocialIconLink
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 border-t border-(--border) pt-4">
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="theme-footer-muted text-xs">
              © {year} {siteInfo.shortName}. Hak Cipta Dilindungi.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="theme-footer-badge-accent inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold">
                Resmi
              </span>

              <span className="theme-footer-badge inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold">
                Layanan Digital
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="3.25"
        y="3.25"
        width="17.5"
        height="17.5"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function XIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 4L10.9 13.2L4.4 20H6.9L12.1 14.5L16.2 20H20L12.8 10.4L18.9 4H16.4L11.6 9.1L7.8 4H4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M13.5 20V12.8H16L16.4 9.9H13.5V8.1C13.5 7.2 13.8 6.6 15.1 6.6H16.5V4C15.8 3.9 15.1 3.8 14.4 3.8C11.9 3.8 10.2 5.3 10.2 8V9.9H7.8V12.8H10.2V20H13.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function YouTubeIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 12C21 9.6 20.8 8 20.4 7C20.1 6.3 19.6 5.8 18.9 5.6C17.7 5.2 12 5.2 12 5.2C12 5.2 6.3 5.2 5.1 5.6C4.4 5.8 3.9 6.3 3.6 7C3.2 8 3 9.6 3 12C3 14.4 3.2 16 3.6 17C3.9 17.7 4.4 18.2 5.1 18.4C6.3 18.8 12 18.8 12 18.8C12 18.8 17.7 18.8 18.9 18.4C19.6 18.2 20.1 17.7 20.4 17C20.8 16 21 14.4 21 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M10 15.2V8.8L15.2 12L10 15.2Z" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14.8 3C15.1 5 16.3 6.4 18.2 6.8V9.3C16.9 9.2 15.8 8.8 14.8 8.1V14.4C14.8 17.6 12.8 20 9.7 20C6.9 20 4.8 17.9 4.8 15.1C4.8 12.1 7.1 10 10.1 10C10.4 10 10.7 10 10.9 10.1V12.7C10.7 12.6 10.4 12.5 10.1 12.5C8.6 12.5 7.4 13.6 7.4 15.1C7.4 16.7 8.5 17.6 9.7 17.6C11.5 17.6 12.2 16.1 12.2 14.9V3H14.8Z" />
    </svg>
  );
}