import { useState, useEffect, useMemo, useRef, useDeferredValue } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNavigationItems } from "../data/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { searchSite } from "../lib/search";

export function useHeader() {
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
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const deferredQuery = useDeferredValue(searchQuery);

  const desktopDropdownRef = useRef(null);

  const suggestions = useMemo(() => {
    const query = deferredQuery.trim();
    if (!query) return [];
    return searchSite(query).slice(0, 5);
  }, [deferredQuery]);

  const showSuggestions =
    deferredQuery.trim().length > 0 && suggestions.length > 0;

  function setLightTheme() {
    if (theme === "dark") toggleTheme();
  }

  function setDarkTheme() {
    if (theme !== "dark") toggleTheme();
  }

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown({});
    setOpenDesktopDropdown(null);
    setSearchQuery("");
    setActiveSuggestionIndex(-1);
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
        setActiveSuggestionIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        prev + 1 >= suggestions.length ? 0 : prev + 1,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev - 1 < 0 ? suggestions.length - 1 : prev - 1,
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

  return {
    pathname,
    locale,
    setLocale,
    t,
    theme,
    toggleTheme,
    navigationItems,
    adminState,
    isMobileMenuOpen,
    openDesktopDropdown,
    setOpenDesktopDropdown,
    openMobileDropdown,
    searchQuery,
    setSearchQuery,
    activeSuggestionIndex,
    desktopDropdownRef,
    suggestions,
    showSuggestions,
    setLightTheme,
    setDarkTheme,
    closeMobileMenu,
    toggleMobileMenu,
    toggleMobileDropdown,
    toggleDesktopDropdown,
    handleSearchSubmit,
    handleSuggestionSelect,
    handleSearchKeyDown,
    handleSearchBlur,
  };
}
