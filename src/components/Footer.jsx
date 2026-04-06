import Link from "next/link";
import { footerMenuLinks, siteInfo, siteLinks } from "../data/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-white dark:border-slate-800">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <p className="text-lg font-bold">{siteInfo.shortName}</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">
            {siteInfo.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={siteLinks.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              WhatsApp
            </a>

            <a
              href={siteLinks.mapDirectionUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Buka Maps
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Menu
          </h2>

          <div className="mt-4 grid gap-2">
            {footerMenuLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-white/80 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Kontak
          </h2>

          <div className="mt-4 space-y-3 text-sm text-white/80">
            <p>{siteInfo.address}</p>
            <a href={siteLinks.emailHref} className="block transition hover:text-white">
              {siteInfo.email}
            </a>
            <a href={siteLinks.phoneHref} className="block transition hover:text-white">
              {siteInfo.phone}
            </a>
            <p>{siteInfo.officeHours}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-white/60 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 {siteInfo.shortName}. All rights reserved.</p>
          <p>Website resmi pelayanan informasi dan komunikasi publik.</p>
        </div>
      </div>
    </footer>
  );
}