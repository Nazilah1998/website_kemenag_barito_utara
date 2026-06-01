"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  useCallback,
} from "react";
import { messagesId } from "../data/i18n-id";

const LanguageContext = createContext(null);

const STORAGE_KEY = "site-locale";
const DEFAULT_LOCALE = "id";

const languageListeners = new Set();

function emitLanguageChange() {
  languageListeners.forEach((listener) => listener());
}

function getLanguageSnapshot() {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const savedLocale = window.localStorage.getItem(STORAGE_KEY);

  if (savedLocale === "id" || savedLocale === "en") {
    return savedLocale;
  }

  return DEFAULT_LOCALE;
}

function getLanguageServerSnapshot() {
  return DEFAULT_LOCALE;
}

function subscribeLanguage(listener) {
  languageListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      languageListeners.delete(listener);
    };
  }

  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    languageListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getByPath(object, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], object);
}

export function LanguageProvider({ children }) {
  const locale = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot,
  );

  const [enMessages, setEnMessages] = useState(null);

  useEffect(() => {
    if (locale === "en" && !enMessages) {
      import("../data/i18n-en.js").then((mod) =>
        setEnMessages(mod.messagesEn),
      );
    }
  }, [locale, enMessages]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale) => {
    if (typeof window === "undefined") return;
    if (nextLocale !== "id" && nextLocale !== "en") return;

    window.localStorage.setItem(STORAGE_KEY, nextLocale);
    emitLanguageChange();
  }, []);

  const messages = useMemo(
    () => ({ id: messagesId, en: enMessages }),
    [enMessages],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (path) =>
        getByPath(messages[locale], path) ??
        getByPath(messagesId, path) ??
        path,
    }),
    [locale, messages, setLocale],
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
