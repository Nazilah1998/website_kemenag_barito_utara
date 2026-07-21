"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";

const ThemeContext = createContext(null);

const DEFAULT_STORAGE_KEY = "site-theme";
const ADMIN_STORAGE_KEY = "admin-theme";
const DEFAULT_THEME = "light";
const VALID_THEMES = new Set(["light", "dark"]);

const themeListeners = new Set();

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function getStorageKey() {
  if (typeof window === "undefined") return DEFAULT_STORAGE_KEY;
  return window.location.pathname.startsWith("/admin") ? ADMIN_STORAGE_KEY : DEFAULT_STORAGE_KEY;
}

function getStoredTheme() {
  if (typeof window === "undefined") return null;
  const key = getStorageKey();
  const savedTheme = window.localStorage.getItem(key);
  return VALID_THEMES.has(savedTheme) ? savedTheme : null;
}

function getSystemTheme() {
  return DEFAULT_THEME;
}

function getResolvedTheme() {
  return getStoredTheme() || DEFAULT_THEME;
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function getThemeSnapshot() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return getResolvedTheme();
}

function getThemeServerSnapshot() {
  return DEFAULT_THEME;
}

function subscribeTheme(listener) {
  themeListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      themeListeners.delete(listener);
    };
  }

  const onStorage = (event) => {
    if (event.key === DEFAULT_STORAGE_KEY || event.key === ADMIN_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function ThemeProvider({ children }) {
  const pathname = usePathname();
  const storageKey = pathname?.startsWith("/admin") ? ADMIN_STORAGE_KEY : DEFAULT_STORAGE_KEY;

  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme: (nextTheme) => {
        if (typeof window === "undefined") return;
        if (!VALID_THEMES.has(nextTheme)) return;

        window.localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
        emitThemeChange();
      },
      toggleTheme: () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        if (typeof window === "undefined") return;

        window.localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
        emitThemeChange();
      },
      clearThemePreference: () => {
        if (typeof window === "undefined") return;

        window.localStorage.removeItem(storageKey);
        const nextTheme = getResolvedTheme();
        applyTheme(nextTheme);
        emitThemeChange();
      },
    }),
    [theme, storageKey],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme harus dipakai di dalam ThemeProvider");
  }

  return context;
}