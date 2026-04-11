"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNavigationItems } from "../data/navigation";
import { siteInfo, siteLinks } from "../data/site";
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
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 ${className}`}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 ${className}`}
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

function MenuItemArrowIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 ${className}`}
    >
      <path d="M7 13l4-4-4-4" />
    </svg>
  );
}

function HamburgerIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 ${className}`}
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 ${className}`}
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function HeaderSearchForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel,
  compact = false,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`group flex items-center gap-3 rounded-full border border-slate-200/90 bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-200 hover:border-emerald-200 focus-within:border-emerald-400 focus-within:shadow-[0_14px_40px_rgba(16,185,129,0.16)] ${compact ? "w-full" : "w-full max-w-90"
        }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition group-focus-within:bg-emerald-100">
        <SearchIcon className="h-4 w-4" />
      </div>

      <input
        type="text"
        inputMode="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className="header-search-input block h-10 w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          outline: "none",
          boxShadow: "none",
          border: "none",
          background: "transparent",
        }}
      />

      <button
        type="submit"
        className="inline-flex h-10 shrink-0 items-center rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.22)] transition duration-200 hover:-translate-y-px hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
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
      ? "inline-flex h-11 items-center rounded-2xl bg-emerald-50 px-4 text-sm font-semibold text-emerald-700"
      : "inline-flex h-11 items-center rounded-2xl px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700";

  const mobileLinkClass = (active) =>
    active
      ? "block rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
      : "block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18.5 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 xl:min-w-95"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 shadow-sm">
              <Image
                src={siteInfo.logoSrc}
                alt={siteInfo.shortName}
                width={34}
                height={34}
                priority
                className="h-8 w-8 object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="whitespace-nowrap text-[17px] font-extrabold tracking-[0.01em] text-slate-900 xl:text-[18px]">
                {siteInfo.shortName}
              </p>
              <p className="hidden whitespace-nowrap text-[11px] leading-none text-slate-500 xl:block">
                {siteInfo.tagline}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:ml-10 xl:flex">
            {navigationItems.map((item) => {
              const active = isItemActive(pathname, item);

              if (item.children?.length) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    ref={
                      openDesktopDropdown === item.label
                        ? desktopDropdownRef
                        : null
                    }
                  >
                    <button
                      type="button"
                      onClick={() => toggleDesktopDropdown(item.label)}
                      className={`${desktopLinkClass(active)} gap-2`}
                      aria-haspopup="menu"
                      aria-expanded={openDesktopDropdown === item.label}
                    >
                      <span>{item.label}</span>
                      <ChevronDownIcon
                        className={`transition duration-200 ${openDesktopDropdown === item.label
                          ? "rotate-180"
                          : ""
                          }`}
                      />
                    </button>

                    {openDesktopDropdown === item.label ? (
                      <div className="absolute left-1/2 top-full z-50 mt-3 w-[320px] -translate-x-1/2">
                        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl">
                          <div className="mb-2 px-3 pt-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                              Menu {item.label}
                            </p>
                          </div>

                          <div className="space-y-1">
                            {item.children.map((child) => {
                              const childActive = isPathActive(
                                pathname,
                                child.href,
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
                                  <span className="leading-6">
                                    {child.label}
                                  </span>
                                  <MenuItemArrowIcon className="opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href || item.label}
                  href={item.href || "/"}
                  className={desktopLinkClass(active)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <HeaderSearchForm
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onSubmit={handleSearchSubmit}
              placeholder={t("header.searchPlaceholder")}
              buttonLabel={t("common.search")}
            />

            {adminState.loaded && adminState.isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex h-12 items-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
              >
                Admin
              </Link>
            ) : null}
          </div>

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 xl:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <div className="mx-auto max-h-[calc(100vh-74px)] max-w-7xl overflow-y-auto px-4 py-4 sm:px-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <HeaderSearchForm
                compact
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onSubmit={handleSearchSubmit}
                placeholder={t("header.searchPlaceholder")}
                buttonLabel={t("common.search")}
              />

              <nav className="mt-4 space-y-2">
                {navigationItems.map((item) => {
                  const active = isItemActive(pathname, item);

                  if (item.children?.length) {
                    const isOpen = !!openMobileDropdown[item.label];

                    return (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-slate-200 bg-white p-2"
                      >
                        <button
                          type="button"
                          onClick={() => toggleMobileDropdown(item.label)}
                          className={
                            active
                              ? "flex w-full items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-left text-sm font-semibold text-emerald-700"
                              : "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                          }
                          aria-expanded={isOpen}
                        >
                          <span>{item.label}</span>
                          <ChevronDownIcon
                            className={`transition duration-200 ${isOpen ? "rotate-180" : ""
                              }`}
                          />
                        </button>

                        {isOpen ? (
                          <div className="mt-2 space-y-1 pl-2">
                            {item.children.map((child) => {
                              const childActive = isPathActive(
                                pathname,
                                child.href,
                              );

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={
                                    childActive
                                      ? "flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
                                      : "flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                                  }
                                >
                                  <span>{child.label}</span>
                                  <MenuItemArrowIcon className="opacity-60" />
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
                      key={item.href || item.label}
                      href={item.href || "/"}
                      className={mobileLinkClass(active)}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {adminState.loaded && adminState.isAdmin ? (
                  <Link
                    href="/admin"
                    className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    Admin
                  </Link>
                ) : null}
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}