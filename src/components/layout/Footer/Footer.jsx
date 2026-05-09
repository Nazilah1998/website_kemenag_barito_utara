import { siteInfo } from "@/data/site";
import { FooterBrand, FooterMenu, FooterContact, FooterSocial } from "./FooterSections";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="theme-footer relative overflow-hidden border-t">
      <div className="absolute inset-0 [background:radial-gradient(circle_at_top_left,rgba(16,185,129,0.1),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.04),transparent_24%)] dark:[background:radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_24%)]" />

      <div className="relative w-full px-6 py-8 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.6fr_1fr_0.8fr]">
          <FooterBrand />
          <FooterMenu />
          <FooterContact />
          <FooterSocial />
        </div>

        <div className="mt-6 border-t border-(--border) pt-4">
          <div className="flex flex-col items-center justify-center gap-4 text-sm sm:flex-row">
            <p className="theme-footer-muted text-center text-xs">© {year} {siteInfo.shortName}. {t("footer.copyright")}.</p>
            <FooterBadges t={t} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterBadges({ t }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="theme-footer-badge-accent inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold">{t("home.focus.statusValue")}</span>
      <span className="theme-footer-badge inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold">{t("home.focus.accessValue")}</span>
    </div>
  );
}
