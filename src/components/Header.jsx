"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNavigationItems } from "../data/navigation";
import { siteInfo } from "../data/site";
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
      className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm"
    >
      <div className="flex flex-1 items-center gap-2 px-3">
        <SearchIcon className="h-4 w-4 text-slate-400" />
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        {buttonLabel}
      </button>
    </form>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, t } = useLanguage();

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

    if (!query) {
      router.push("/pencarian");
      return;
    }

    router.push(`/pencarian?q=${encodeURIComponent(query)}`);
  }

  const desktopLinkClass = (active) =>
    active
      ? "inline-flex h-11 items-center gap-1.5 rounded-full bg-emerald-50 px-4 text-sm font-semibold text-emerald-700"
      : "inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700";

  const mobileLinkClass = (active) =>
    active
      ? "flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
      : "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 p-2 ring-1 ring-emerald-100">
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
              <p className="truncate text-base font-extrabold uppercase tracking-wide text-emerald-800 sm:text-xl">
                {siteInfo.shortName}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
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
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <nav
            ref={desktopDropdownRef}
            className="hidden flex-1 flex-wrap items-center gap-1 lg:flex"
            aria-label="Navigasi utama"
          >
            {navigationItems.map((item) => {
              const active = isItemActive(pathname, item);

              if (item.children?.length) {
                const isOpen = openDesktopDropdown === item.label;

                return (
                  <div key={item.label} className="relative">
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
                      <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-3xl border border-slate-100 bg-white p-2 shadow-xl">
                        <p className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-400">
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
                                onClick={() => setOpenDesktopDropdown(null)}
                                className={
                                  childActive
                                    ? "group flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
                                    : "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
                                }
                              >
                                <span>{child.label}</span>
                                <MenuItemArrowIcon className="h-4 w-4 opacity-60 transition group-hover:translate-x-1" />
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
                  className={desktopLinkClass(active)}
                >
                  <span>{item.label}</span>
                  {item.label !== "Berita" ? (
                    <ChevronDownIcon className="h-4 w-4 opacity-60" />
                  ) : null}
                </Link>
              );
            })}

            {adminState.loaded && adminState.isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex h-11 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Admin
              </Link>
            ) : null}
          </nav>

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 lg:hidden"
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
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="mx-auto max-w-7xl space-y-4">
            <HeaderSearchForm
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onSubmit={handleSearchSubmit}
              placeholder={t("header.searchPlaceholder")}
              buttonLabel={t("common.search")}
            />

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
                                    ? "flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
                                    : "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
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
                    {item.label !== "Berita" ? (
                      <ChevronDownIcon className="h-4 w-4 opacity-60" />
                    ) : null}
                  </Link>
                );
              })}

              {adminState.loaded && adminState.isAdmin ? (
                <Link
                  href="/admin"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Admin
                </Link>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}