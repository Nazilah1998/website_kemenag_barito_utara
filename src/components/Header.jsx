"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9Z" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const navigationItems = useMemo(() => getNavigationItems(locale), [locale]);

  const [adminState, setAdminState] = useState({
    loaded: false,
    isAdmin: false,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState({});
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown({});
    setIsLanguageOpen(false);
  }, [pathname]);

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
      ? "inline-flex h-11 items-center rounded-2xl bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      : "inline-flex h-11 items-center rounded-2xl px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-emerald-400";

  const mobileLinkClass = (active) =>
    active
      ? "block rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      : "block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-emerald-400";

  const controlButtonClass =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-800";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-xs text-slate-600 md:flex-row md:items-center md:justify-between dark:text-slate-300">
            <div className="hidden items-center gap-4 md:flex">
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

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <span>{siteInfo.officeHours}</span>
              <Link
                href="/kontak"
                className="font-medium text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                {t("header.contact")}
              </Link>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between gap-4 py-4 xl:gap-6">
              <Link
                href="/"
                className="flex min-w-0 items-center gap-3 xl:w-[360px] xl:flex-shrink-0"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-500/10">
                  <Image
                    src={siteInfo.logoSrc}
                    alt={siteInfo.shortName}
                    width={34}
                    height={34}
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="whitespace-nowrap text-sm font-extrabold uppercase tracking-[0.08em] text-slate-900 md:text-base dark:text-slate-100">
                    {siteInfo.shortName}
                  </p>
                  <p className="mt-1 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">
                    {siteInfo.tagline}
                  </p>
                </div>
              </Link>

              <nav className="hidden xl:flex xl:flex-1 xl:items-center xl:gap-1 xl:pl-4">
                {navigationItems.map((item) => {
                  const active = isItemActive(pathname, item);

                  if (item.children?.length) {
                    return (
                      <div key={item.label} className="group relative">
                        <button
                          type="button"
                          className={`${desktopLinkClass(active)} gap-2`}
                        >
                          {item.label}
                          <span className="text-xs">▾</span>
                        </button>

                        <div className="invisible absolute left-0 top-full z-30 mt-2 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-slate-800 dark:bg-slate-900">
                          {item.children.map((child) => {
                            const childActive = isPathActive(pathname, child.href);

                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                className={
                                  childActive
                                    ? "block rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                    : "block rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                                }
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

              <div className="hidden xl:flex xl:flex-shrink-0 xl:items-center xl:gap-3">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-white pl-4 pr-2 dark:border-slate-800 dark:bg-slate-900"
                >
                  <SearchIcon />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("header.searchPlaceholder")}
                    className="w-56 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-8 items-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {t("common.search")}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className={controlButtonClass}
                  aria-label={
                    theme === "dark" ? t("common.light") : t("common.dark")
                  }
                  title={
                    theme === "dark" ? t("common.light") : t("common.dark")
                  }
                >
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>

                <div className="relative z-30">
                  <button
                    type="button"
                    onClick={() => setIsLanguageOpen((prev) => !prev)}
                    className={`${controlButtonClass} gap-2`}
                    aria-label={t("header.languageLabel")}
                    title={t("header.languageLabel")}
                  >
                    <GlobeIcon />
                    {locale.toUpperCase()}
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute right-0 top-full mt-2 w-36 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
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
                          {item.toUpperCase()}
                          {locale === item ? "✓" : null}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {adminState.loaded && adminState.isAdmin ? (
                  <Link href="/admin" className={controlButtonClass}>
                    Admin
                  </Link>
                ) : null}
              </div>

              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 transition hover:bg-slate-50 xl:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-label={
                  isMobileMenuOpen
                    ? t("header.closeMenu")
                    : t("header.openMenu")
                }
                title={
                  isMobileMenuOpen
                    ? t("header.closeMenu")
                    : t("header.openMenu")
                }
              >
                {isMobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="border-t border-slate-200 pb-5 pt-4 xl:hidden dark:border-slate-800">
              <div className="mx-auto max-w-7xl space-y-4 px-4">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <SearchIcon />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("header.searchPlaceholder")}
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {t("common.search")}
                  </button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <p className="font-semibold">{siteInfo.officeHours}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={siteLinks.emailHref}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Email
                    </a>
                    <a
                      href={siteLinks.phoneHref}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Telepon
                    </a>
                    <Link
                      href="/kontak"
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Kontak
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    {theme === "dark" ? t("common.light") : t("common.dark")}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
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
                </div>

                {adminState.loaded && adminState.isAdmin ? (
                  <Link
                    href="/admin"
                    className="block rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Admin
                  </Link>
                ) : null}

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
                                const childActive = isPathActive(
                                  pathname,
                                  child.href
                                );

                                return (
                                  <Link
                                    key={child.href}
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
                        key={item.href}
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
        </div>
      </header>

      {isLanguageOpen && (
        <button
          type="button"
          aria-label="Close language dropdown"
          onClick={() => setIsLanguageOpen(false)}
          className="fixed inset-0 z-20 cursor-default bg-transparent"
        />
      )}
    </>
  );
}