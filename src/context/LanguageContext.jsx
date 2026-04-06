"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { messages } from "../data/i18n";

const LanguageContext = createContext(null);
const STORAGE_KEY = "site-locale";

function getInitialLocale() {
  if (typeof window === "undefined") return "id";

  const savedLocale = window.localStorage.getItem(STORAGE_KEY);
  if (savedLocale && messages[savedLocale]) return savedLocale;

  return "id";
}

function getByPath(object, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], object);
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (nextLocale) => {
    if (messages[nextLocale]) {
      setLocaleState(nextLocale);
    }
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (path) =>
        getByPath(messages[locale], path) ??
        getByPath(messages.id, path) ??
        path,
    }),
    [locale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage harus dipakai di dalam LanguageProvider");
  }

  return context;
}