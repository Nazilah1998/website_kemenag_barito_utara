"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNavigationItems } from "../data/navigation";
import { siteInfo } from "../data/site";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { searchSite } from "../lib/search";


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
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
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
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  onKeyDown,
  onBlur,
  placeholder,
  buttonLabel,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  listboxId,
  activeIndex,
}) {
  const hasSuggestions = showSuggestions && suggestions.length > 0;
  const activeOptionId =
    hasSuggestions && activeIndex >= 0
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  return (
    <div className="relative">
      <form
        onSubmit={onSubmit}
        role="search"
        aria-label="Pencarian website"
        className="flex w-full items-center gap-2 rounded-full border border-slate-300 bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition focus-within:border-emerald-500 focus-within:shadow-[0_12px_36px_rgba(16,185,129,0.12)] dark:border-slate-700 dark:bg-slate-950/90 dark:focus-within:border-emerald-500/60"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className="flex flex-1 items-center gap-2 px-3">
          <SearchIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <input
            type="search"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={hasSuggestions}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            className="w-full border-0 bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-500 outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none dark:text-slate-100 dark:placeholder:text-slate-400"
            style={{
              WebkitAppearance: "none",
              appearance: "none",
              boxShadow: "none",
              border: "none",
              outline: "none",
            }}
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          {buttonLabel}
        </button>
      </form>

      {hasSuggestions ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950"
        >
          {suggestions.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${item.href}-${item.title}-${index}`}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isActive}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelectSuggestion(item)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${isActive
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/70"
                  }`}
              >
                <span className="font-medium">{item.title}</span>
                <span className="ml-3 shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  {item.section}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}


function UtilityPill({ children, className = "" }) {
  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-1 py-1 dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
    >
      {children}
    </div>
  );
}


function desktopLinkClass(active) {
  return active
    ? "flex items-center gap-1 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
    : "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:hover:text-emerald-300";
}


function mobileLinkClass(active) {
  return active
    ? "flex w-full items-center justify-between rounded-3xl bg-emerald-50 px-4 py-3.5 text-sm font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
    : "flex w-full items-center justify-between rounded-3xl px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:hover:text-emerald-300";
}


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = useMemo(() => getNavigationItems(locale), [locale]);

  const [adminState, setAdminState] = useState({ loaded: false, isAdmin: false });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const desktopDropdownRef = useRef(null);

  const suggestions = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return [];
    return searchSite(query).slice(0, 5);
  }, [searchQuery]);

  const showSuggestions = searchQuery.trim().length > 0 && suggestions.length > 0;

  // Theme helpers
  function setLightTheme() {
    if (theme === "dark") toggleTheme();
  }

  function setDarkTheme() {
    if (theme !== "dark") toggleTheme();
  }

  // Admin session
  useEffect(() => {
    let mounted = true;

    async function checkAdminSession() {
      try {
        const res = await fetch("/api/admin/session", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Gagal membaca session admin");

        const data = await res.json();

        if (!mounted) return;
        setAdminState({
          loaded: true,
          isAdmin: Boolean(data?.permissions?.isAdmin),
        });
      } catch {
        if (!mounted) return;
        setAdminState({ loaded: true, isAdmin: false });
      }
    }

    checkAdminSession();
    return () => {
      mounted = false;
    };
  }, []);

  // Reset on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown({});
    setOpenDesktopDropdown(null);
    setSearchQuery("");
    setActiveSuggestionIndex(-1);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setOpenDesktopDropdown(null);
        setActiveSuggestionIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
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

    const activeSuggestion =
      activeSuggestionIndex >= 0 ? suggestions[activeSuggestionIndex] : null;

    if (activeSuggestion?.href) {
      closeMobileMenu();
      setSearchQuery("");
      setActiveSuggestionIndex(-1);
      router.push(activeSuggestion.href);
      return;
    }

    const query = searchQuery.trim();
    closeMobileMenu();
    setSearchQuery("");
    setActiveSuggestionIndex(-1);

    if (!query) {
      router.push("/pencarian");
      return;
    }

    router.push(`/pencarian?q=${encodeURIComponent(query)}`);
  }

  function handleSuggestionSelect(item) {
    closeMobileMenu();
    setSearchQuery("");
    setActiveSuggestionIndex(-1);
    router.push(item.href);
  }

  function handleSearchKeyDown(event) {
    if (!showSuggestions) {
      if (event.key === "Escape") {
        setActiveSuggestionIndex(-1);
        setSearchQuery("");
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev + 1 >= suggestions.length ? 0 : prev + 1
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev - 1 < 0 ? suggestions.length - 1 : prev - 1
      );
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setSearchQuery("");
      setActiveSuggestionIndex(-1);
    }
  }

  function handleSearchBlur() {
    setTimeout(() => setActiveSuggestionIndex(-1), 150);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-100 w-full bg-white/95 shadow-sm backdrop-blur dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-4 pt-2">

        {/* Top bar */}
        <div className="flex items-center justify-between py-3">

          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 p-2 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
              <Image
                src={siteInfo.logoSrc}
                alt={siteInfo.shortName}
                width={40}
                height={40}
                className="h-auto w-10 object-contain"
              />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                {siteInfo.shortName}
              </p>
              <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {siteInfo.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop search */}
          <div className="mx-6 hidden max-w-sm flex-1 lg:block">
            <HeaderSearchForm
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onSubmit={handleSearchSubmit}
              onKeyDown={handleSearchKeyDown}
              onBlur={handleSearchBlur}
              placeholder={t("header.searchPlaceholder")}
              buttonLabel={t("common.search")}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              onSelectSuggestion={handleSuggestionSelect}
              listboxId="desktop-search-listbox"
              activeIndex={activeSuggestionIndex}
            />
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100 dark:hover:bg-slate-900 lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            Menu
            {isMobileMenuOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <HamburgerIcon className="h-5 w-5" />
            )}
          </button>

        </div>

        {/* Desktop nav bar */}
        <div className="hidden pb-4 lg:block">
          <div
            ref={desktopDropdownRef}
            className="theme-header-nav rounded-[30px] border border-slate-200/80 bg-white/80 px-4 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-[0_18px_42px_rgba(2,6,23,0.30)]"
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
                            <div className="theme-dropdown absolute left-0 top-full z-50 mt-3 w-80 rounded-[28px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_18px_44px_rgba(2,6,23,0.38)]">
                              <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
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
                                          ? "group flex items-center justify-between rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                          : "group flex items-center justify-between rounded-3xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:hover:text-emerald-300"
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

              <div className="flex shrink-0 items-center gap-2 border-l border-slate-200 pl-4 dark:border-slate-800">
                <UtilityPill>
                  <button
                    type="button"
                    onClick={() => setLocale("id")}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-black transition ${locale === "id"
                      ? "theme-chip-active"
                      : "theme-chip dark:text-slate-200"
                      }`}
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale("en")}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-black transition ${locale === "en"
                      ? "theme-chip-active"
                      : "theme-chip dark:text-slate-200"
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
                      : "theme-chip dark:text-slate-200"
                      }`}
                  >
                    <SunIcon className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={setDarkTheme}
                    aria-label="Tema gelap"
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${theme === "dark"
                      ? "bg-slate-900 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-emerald-300"
                      }`}
                  >
                    <MoonIcon className="h-4 w-4" />
                  </button>
                </UtilityPill>

                {adminState.loaded && adminState.isAdmin ? (
                  <Link
                    href="/admin"
                    className="inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-sm font-black text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                  >
                    Admin
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile overlay menu */}
      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-[3px] lg:hidden">
          <button
            type="button"
            onClick={closeMobileMenu}
            className="absolute inset-0"
            aria-label="Tutup menu"
          />

          <aside className="fixed inset-x-4 top-4 z-72 flex h-[calc(100dvh-32px)] flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-950/96 dark:shadow-[0_30px_80px_rgba(2,6,23,0.55)]">

            {/* Header inside mobile */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex min-w-0 items-center gap-3"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 p-2 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
                  <Image
                    src={siteInfo.logoSrc}
                    alt={siteInfo.shortName}
                    width={40}
                    height={40}
                    className="h-auto w-10 object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                    {siteInfo.shortName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {siteInfo.tagline}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="ml-3 shrink-0 rounded-full border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100"
                aria-label="Tutup menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Search inside mobile */}
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <HeaderSearchForm
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onSubmit={handleSearchSubmit}
                onKeyDown={handleSearchKeyDown}
                onBlur={handleSearchBlur}
                placeholder={t("header.searchPlaceholder")}
                buttonLabel={t("common.search")}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                onSelectSuggestion={handleSuggestionSelect}
                listboxId="mobile-search-listbox"
                activeIndex={activeSuggestionIndex}
              />
            </div>

            {/* Locale & Theme */}
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <UtilityPill className="justify-center">
                  <button
                    type="button"
                    onClick={() => setLocale("id")}
                    className={`rounded-full px-3 py-2 text-xs font-black transition ${locale === "id"
                      ? "theme-chip-active"
                      : "theme-chip dark:text-slate-200"
                      }`}
                  >
                    Indonesia
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale("en")}
                    className={`rounded-full px-3 py-2 text-xs font-black transition ${locale === "en"
                      ? "theme-chip-active"
                      : "theme-chip dark:text-slate-200"
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
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${theme !== "dark"
                      ? "theme-icon-button-active"
                      : "theme-icon-button dark:text-slate-200"
                      }`}
                  >
                    <SunIcon className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={setDarkTheme}
                    aria-label="Tema gelap"
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${theme === "dark"
                      ? "theme-icon-button-active-dark"
                      : "theme-icon-button dark:text-slate-200 dark:hover:bg-slate-800/70"
                      }`}
                  >
                    <MoonIcon className="h-4 w-4" />
                  </button>
                </UtilityPill>
              </div>
            </div>

            {/* Nav links */}
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
                          <div className="ml-3 space-y-1 border-l border-slate-100 pl-3 dark:border-slate-800">
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
                                      ? "flex items-center justify-between rounded-3xl bg-emerald-50 px-4 py-3.5 text-sm font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                      : "flex items-center justify-between rounded-3xl px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:hover:text-emerald-300"
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
                    className="flex items-center justify-center rounded-3xl bg-slate-900 px-4 py-3.5 text-sm font-black text-white dark:bg-emerald-500 dark:text-slate-950"
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