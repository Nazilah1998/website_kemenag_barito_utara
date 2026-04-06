"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNavigationItems } from "../data/navigation";
import { siteInfo, siteLinks } from "../data/site";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

function isPathActive(pathname, href) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function isItemActive(pathname, item) {
  if (isPathActive(pathname, item.href)) return true;
  if (item.children?.length) {
    return item.children.some((child) => isPathActive(pathname, child.href));
  }
  return false;
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M20 15.5A8.5 8.5 0 1 1 8.5 4 7 7 0 0 0 20 15.5Z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  const navigationItems = useMemo(() => getNavigationItems(locale), [locale]);

function isItemActive(pathname, item) {
  if (isPathActive(pathname, item.href)) return true;
  if (item.children?.length) {
    return item.children.some((child) => isPathActive(pathname, child.href));
  }
  return false;
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M20 15.5A8.5 8.5 0 1 1 8.5 4 7 7 0 0 0 20 15.5Z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

export default function Header(
  const [adminState, setAdminState] = useState({
  loaded: false,
  isAdmin: false,
});

useEffect(() => {
  let mounted = true;

  async function checkAdminSession() {
    try {
      const res = await fetch("/api/admin/session", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Gagal membaca session admin");
      }

      const data = await res.json();

      if (!mounted) return;

      setAdminState({
        loaded: true,
        isAdmin: Boolean(data?.permissions?.isAdmin),
      });
    } catch (error) {
      if (!mounted) return;

      setAdminState({
        loaded: true,
        isAdmin: false,
      });
    }
  }

  checkAdminSession();

  return () => {
    mounted = false;
  };
}, []);
) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const navigationItems = useMemo(() => getNavigationItems(locale), [locale]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState({});
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown({});
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((prev) => !prev);
  }

  function toggleMobileDropdown(label) {
    setOpenMobileDropdown((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const query = searchQuery.trim();
    closeMobileMenu();

    if (!query) {
      router.push("/pencarian");
      return;
    }

    router.push(`/pencarian?q=${encodeURIComponent(query)}`);
  }

  const desktopLinkClass = (active) =>
    active
      ? "inline-flex items-center rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      : "inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-emerald-400";

  const mobileLinkClass = (active) =>
    active
      ? "block rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      : "block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-emerald-400";

  const controlButtonClass =
    "inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800";

  return (
    <>
      {/* WRAPPER UTAMA HEADER */}
      <header className="sticky top-0 z-[60] border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/85">
        {/* TOP BAR */}
        <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={siteLinks.emailHref}
                className="transition hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                Email: {siteInfo.email}
              </a>

              <a
                href={siteLinks.phoneHref}
                className="transition hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                Telepon: {siteInfo.phone}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span>{siteInfo.officeHours}</span>
              <Link
                href="/kontak"
                className="font-medium text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

        {/* BARIS UTAMA HEADER */}
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
          {/* LOGO */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            onClick={closeMobileMenu}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <Image
                src={siteInfo.logoSrc}
                alt={siteInfo.shortName}
                width={40}
                height={40}
                className="h-9 w-9 object-contain"
                priority
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100 sm:text-base">
                {siteInfo.shortName}
              </p>
              <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
                {siteInfo.tagline}
              </p>
            </div>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {navigationItems.map((item) => {
              const active = isItemActive(pathname, item);

              if (item.children?.length) {
                return (
                  <div key={item.label} className="group relative">
                    <button type="button" className={desktopLinkClass(active)}>
                      {item.label}
                      <span className="ml-2 text-xs">▾</span>
                    </button>

                    {/* DROPDOWN DESKTOP */}
                    <div className="invisible absolute left-0 top-[calc(100%+8px)] z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-900">
                      {item.children.map((child) => {
                        const childActive = isPathActive(pathname, child.href);

                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={mobileLinkClass(childActive)}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={desktopLinkClass(active)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* KONTROL DESKTOP */}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            {/* SEARCH HEADER */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white pl-4 pr-2 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-slate-400 dark:text-slate-500">
                <SearchIcon />
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("header.searchPlaceholder")}
                className="w-56 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              />

              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                {t("common.search")}
              </button>
            </form>

            {/* TOMBOL PENGGANTI THEME */}
            <button
              type="button"
              onClick={toggleTheme}
              className={controlButtonClass}
              aria-label={t("header.themeLabel")}
              title={t("header.themeLabel")}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* TOMBOL PINDAH BAHASA */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLanguageOpen((prev) => !prev)}
                className={`${controlButtonClass} gap-2`}
                aria-label={t("header.languageLabel")}
                title={t("header.languageLabel")}
              >
                <GlobeIcon />
                <span>{locale.toUpperCase()}</span>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-36 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  {["id", "en"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setLocale(item);
                        setIsLanguageOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${
                        locale === item
                          ? "bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{item.toUpperCase()}</span>
                      {locale === item ? <span>✓</span> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TOMBOL BURGER MOBILE */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-label={isMobileMenuOpen ? t("header.closeMenu") : t("header.openMenu")}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE MENU WRAPPER */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white shadow-lg md:hidden dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-4 px-4 py-4">
              {/* SEARCH MOBILE */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="px-2 text-slate-400 dark:text-slate-500">
                  <SearchIcon />
                </span>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("header.searchPlaceholder")}
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  {t("common.search")}
                </button>
              </form>

              {/* INFO MOBILE */}
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <p>{siteInfo.officeHours}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a href={siteLinks.emailHref} className="font-medium hover:text-emerald-700 dark:hover:text-emerald-400">
                    Email
                  </a>
                  <a href={siteLinks.phoneHref} className="font-medium hover:text-emerald-700 dark:hover:text-emerald-400">
                    Telepon
                  </a>
                  <Link href="/kontak" onClick={closeMobileMenu} className="font-medium hover:text-emerald-700 dark:hover:text-emerald-400">
                    Kontak
                  </Link>
                </div>
              </div>

              {/* TOMBOL THEME + LANGUAGE MOBILE */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                >
                  {theme === "dark" ? t("common.light") : t("common.dark")}
                </button>

                <button
                  type="button"
                  onClick={() => setLocale("id")}
                  className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${
                    locale === "id"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                  }`}
                >
                  ID
                </button>

                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${
                    locale === "en"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* NAV MOBILE */}
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const active = isItemActive(pathname, item);

                  if (item.children?.length) {
                    const isOpen = !!openMobileDropdown[item.label];

                    return (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-slate-200 p-2 dark:border-slate-800"
                      >
                        <button
                          type="button"
                          onClick={() => toggleMobileDropdown(item.label)}
                          className={
                            active
                              ? "flex w-full items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
                          }
                        >
                          {item.label}
                          <span>{isOpen ? "▴" : "▾"}</span>
                        </button>

                        {isOpen && (
                          <div className="mt-2 space-y-1">
                            {item.children.map((child) => {
                              const childActive = isPathActive(pathname, child.href);

                              return (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={closeMobileMenu}
                                  className={mobileLinkClass(childActive)}
                                >
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={mobileLinkClass(active)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* OVERLAY UNTUK TUTUP DROPDOWN BAHASA SAAT KLIK LUAR */}
      {isLanguageOpen && (
        <button
          type="button"
          aria-label="Tutup dropdown bahasa"
          onClick={() => setIsLanguageOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-transparent"
        />
      )}
    </>
  );
}