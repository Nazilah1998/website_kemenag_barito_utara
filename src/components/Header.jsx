"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNavigationItems } from "../data/navigation";
import { siteInfo } from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

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

function SearchIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuItemArrowIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 5 12.5 10 7.5 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HamburgerIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SunIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeaderSearchForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition focus-within:border-emerald-300 focus-within:shadow-[0_12px_36px_rgba(16,185,129,0.12)]"
    >
      <div className="flex flex-1 items-center gap-2 px-3">
        <SearchIcon className="h-4 w-4 text-slate-400" />
        <input
          data-1p-ignore
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="header-search-input w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400"
          style={{
            border: "none",
            outline: "none",
            boxShadow: "none",
            WebkitAppearance: "none",
            appearance: "none",
            backgroundColor: "transparent",
            caretColor: "#047857",
          }}
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
      >
        {buttonLabel}
      </button>
    </form>
  );
}

function UtilityPill({ children, className = "" }) {
  return (
    <div
      className={`theme-surface-soft theme-border flex items-center gap-1 rounded-full border px-1 py-1 ${className}`}
    >
      {children}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = useMemo(() => getNavigationItems(locale), [locale]);

  const [adminState, setAdminState] = useState({
    loaded: false,
    isAdmin: false,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const desktopDropdownRef = useRef(null);

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
      } catch {
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
    setOpenDesktopDropdown(null);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setOpenDesktopDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  function toggleDesktopDropdown(label) {
    setOpenDesktopDropdown((prev) => (prev === label ? null : label));
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const query = searchQuery.trim();

    closeMobileMenu();
    setSearchQuery("");

    if (!query) {
      router.push("/pencarian");
      return;
    }

    router.push(`/pencarian?q=${encodeURIComponent(query)}`);
  }

  function setLightTheme() {
    if (theme === "dark") toggleTheme();
  }

  function setDarkTheme() {
    if (theme !== "dark") toggleTheme();
  }

  const desktopLinkClass = (active) =>
    active
      ? "theme-nav-link-active inline-flex h-10 items-center gap-1 rounded-full px-3 text-[14px] font-black whitespace-nowrap transition"
      : "theme-nav-link inline-flex h-10 items-center gap-1 rounded-full px-3 text-[14px] font-bold whitespace-nowrap transition";

  const mobileLinkClass = (active) =>
    active
      ? "theme-nav-link-active flex items-center justify-between rounded-3xl px-4 py-3.5 text-sm font-black transition"
      : "theme-nav-link flex items-center justify-between rounded-3xl px-4 py-3.5 text-sm font-bold transition";
  return (
    <header className="theme-header sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="theme-accent-soft flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border p-2 shadow-sm">
              <Image
                src={siteInfo.logoSrc}
                alt={siteInfo.shortName}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
                priority
              />
            </span>

            <div className="min-w-0">
              <p className="truncate text-base font-black uppercase tracking-wide text-emerald-800 sm:text-xl">
                {siteInfo.shortName}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-600 sm:text-sm">
                {siteInfo.tagline}
              </p>
            </div>
          </Link>

          <div className="hidden w-full max-w-md md:block">
            <HeaderSearchForm
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onSubmit={handleSearchSubmit}
              placeholder={t("header.searchPlaceholder")}
              buttonLabel={t("common.search")}
            />
          </div>

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label="Buka menu"
          >
            Menu
            {isMobileMenuOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <HamburgerIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="hidden pb-4 lg:block">
          <div
            ref={desktopDropdownRef}
            className="theme-header-nav rounded-[30px] px-4 py-2 backdrop-blur"
          >
            <div className="flex items-center gap-4">
              <div className="relative min-w-0 flex-1 overflow-visible">
                <nav
                  className="flex items-center gap-0.5 whitespace-nowrap"
                  aria-label="Navigasi utama"
                >
                  {navigationItems.map((item) => {
                    const active = isItemActive(pathname, item);

                    if (item.children?.length) {
                      const isOpen = openDesktopDropdown === item.label;

                      return (
                        <div key={item.label} className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleDesktopDropdown(item.label)}
                            className={desktopLinkClass(active)}
                            aria-haspopup="menu"
                            aria-expanded={isOpen}
                          >
                            <span>{item.label}</span>
                            <ChevronDownIcon
                              className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""
                                }`}
                            />
                          </button>

                          {isOpen ? (
                            <div className="theme-dropdown absolute left-0 top-full z-50 mt-3 w-80 rounded-[28px] p-3">
                              <p className="theme-text-soft px-3 py-2 text-xs font-black uppercase tracking-[0.25em]">
                                Menu {item.label}
                              </p>

                              <div className="space-y-1">
                                {item.children.map((child) => {
                                  const childActive = isPathActive(
                                    pathname,
                                    child.href
                                  );

                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() =>
                                        setOpenDesktopDropdown(null)
                                      }
                                      className={
                                        childActive
                                          ? "group flex items-center justify-between rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700"
                                          : "group flex items-center justify-between rounded-3xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                                      }
                                    >
                                      <span>{child.label}</span>
                                      <MenuItemArrowIcon className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5" />
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${desktopLinkClass(active)} shrink-0`}
                      >
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="flex shrink-0 items-center gap-2 border-l border-slate-200 pl-4">
                <UtilityPill>
                  <button
                    type="button"
                    onClick={() => setLocale("id")}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-black transition ${locale === "id"
                      ? "theme-chip-active"
                      : "theme-chip"
                      }`}
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale("en")}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-black transition ${locale === "en"
                      ? "theme-chip-active"
                      : "theme-chip"
                      }`}
                  >
                    EN
                  </button>
                </UtilityPill>

                <UtilityPill>
                  <button
                    type="button"
                    onClick={setLightTheme}
                    aria-label="Tema terang"
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${theme !== "dark"
                      ? "theme-chip-active"
                      : "theme-chip"
                      }`}
                  >
                    <SunIcon className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={setDarkTheme}
                    aria-label="Tema gelap"
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${theme === "dark"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                      }`}
                  >
                    <MoonIcon className="h-4 w-4" />
                  </button>
                </UtilityPill>

                {adminState.loaded && adminState.isAdmin ? (
                  <Link
                    href="/admin"
                    className="inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-sm font-black text-white transition hover:bg-slate-800"
                  >
                    Admin
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-70 bg-slate-950/45 backdrop-blur-[3px] lg:hidden">
          <button
            type="button"
            onClick={closeMobileMenu}
            className="absolute inset-0"
            aria-label="Tutup menu"
          />

          <aside className="fixed inset-x-4 top-4 z-72 flex h-[calc(100dvh-32px)] flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex min-w-0 items-center gap-3"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 p-2 ring-1 ring-emerald-100">
                  <Image
                    src={siteInfo.logoSrc}
                    alt={siteInfo.shortName}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-black uppercase tracking-wide text-emerald-800">
                    {siteInfo.shortName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">
                    {siteInfo.tagline}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="theme-surface-strong theme-border ml-3 shrink-0 rounded-full border p-2 shadow-sm"
                aria-label="Tutup menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-slate-100 px-5 py-4">
              <HeaderSearchForm
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onSubmit={handleSearchSubmit}
                placeholder={t("header.searchPlaceholder")}
                buttonLabel={t("common.search")}
              />
            </div>

            <div className="border-b border-slate-100 px-5 py-4">
              <div className="grid grid-cols-2 gap-3">
                <UtilityPill className="justify-center">
                  <button
                    type="button"
                    onClick={() => setLocale("id")}
                    className={`rounded-full px-3 py-2 text-xs font-black transition ${locale === "id"
                      ? "theme-chip-active"
                      : "theme-chip"
                      }`}
                  >
                    Indonesia
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale("en")}
                    className={`rounded-full px-3 py-2 text-xs font-black transition ${locale === "en"
                      ? "theme-chip-active"
                      : "theme-chip"
                      }`}
                  >
                    English
                  </button>
                </UtilityPill>

                <UtilityPill className="justify-center">
                  <button
                    type="button"
                    onClick={setLightTheme}
                    aria-label="Tema terang"
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${theme !== "dark" ? "theme-icon-button-active" : "theme-icon-button"
                      }`}
                  >
                    <SunIcon className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={setDarkTheme}
                    aria-label="Tema gelap"
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${theme === "dark" ? "theme-icon-button-active-dark" : "theme-icon-button"
                      }`}
                  >
                    <MoonIcon className="h-4 w-4" />
                  </button>
                </UtilityPill>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <nav className="space-y-2" aria-label="Navigasi mobile">
                {navigationItems.map((item) => {
                  const active = isItemActive(pathname, item);

                  if (item.children?.length) {
                    const isOpen = !!openMobileDropdown[item.label];

                    return (
                      <div key={item.label} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => toggleMobileDropdown(item.label)}
                          className={mobileLinkClass(active)}
                          aria-expanded={isOpen}
                        >
                          <span>{item.label}</span>
                          <ChevronDownIcon
                            className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>

                        {isOpen ? (
                          <div className="ml-3 space-y-1 border-l border-slate-100 pl-3">
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
                                  className={
                                    childActive
                                      ? "flex items-center justify-between rounded-3xl bg-emerald-50 px-4 py-3.5 text-sm font-black text-emerald-700"
                                      : "flex items-center justify-between rounded-3xl px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                                  }
                                >
                                  <span>{child.label}</span>
                                  <MenuItemArrowIcon className="h-4 w-4 opacity-60" />
                                </Link>
                              );
                            })}
                          </div>
                        ) : null}
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
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {adminState.loaded && adminState.isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center rounded-3xl bg-slate-900 px-4 py-3.5 text-sm font-black text-white"
                  >
                    Admin
                  </Link>
                ) : null}
              </nav>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}