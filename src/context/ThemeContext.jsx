"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "site-theme";
const DEFAULT_THEME = "light";
const VALID_THEMES = new Set(["light", "dark"]);

const themeListeners = new Set();

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function getStoredTheme() {
  if (typeof window === "undefined") return null;
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  return VALID_THEMES.has(savedTheme) ? savedTheme : null;
}

function getSystemTheme() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getResolvedTheme() {
  return getStoredTheme() || getSystemTheme();
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

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  const onMediaChange = () => {
    if (!getStoredTheme()) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", onMediaChange);
  } else {
    mediaQuery.addListener(onMediaChange);
  }

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);

    if (typeof mediaQuery.removeEventListener === "function") {
      mediaQuery.removeEventListener("change", onMediaChange);
    } else {
      mediaQuery.removeListener(onMediaChange);
    }
  };
}

export function ThemeProvider({ children }) {
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

        window.localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
        emitThemeChange();
      },
      toggleTheme: () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        if (typeof window === "undefined") return;

        window.localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
        emitThemeChange();
      },
      clearThemePreference: () => {
        if (typeof window === "undefined") return;

        window.localStorage.removeItem(STORAGE_KEY);
        const nextTheme = getResolvedTheme();
        applyTheme(nextTheme);
        emitThemeChange();
      },
    }),
    [theme],
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