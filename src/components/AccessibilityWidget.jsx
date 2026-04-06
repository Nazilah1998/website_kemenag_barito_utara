"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { siteInfo } from "../data/site";
const STORAGE_KEY = "kemenag-accessibility-settings";
const DEFAULT_SETTINGS = {
  fontScale: 1,
  highContrast: false,
  underlineLinks: false,
  reduceMotion: false,
  dyslexiaFont: false,
  bigCursor: false,
};
function AccessibilityIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {" "}
      <circle cx="12" cy="4.5" r="1.5" /> <path d="M7 8.5h10" />{" "}
      <path d="M12 8.5v11" /> <path d="M8.5 20l3.5-6 3.5 6" />{" "}
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {" "}
      <path d="M5 12h14" />{" "}
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {" "}
      <path d="M12 5v14M5 12h14" />{" "}
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
      {" "}
      <circle cx="12" cy="12" r="4" />{" "}
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />{" "}
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
      {" "}
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />{" "}
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
      {" "}
      <circle cx="12" cy="12" r="9" /> <path d="M3 12h18" />{" "}
      <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9Z" />{" "}
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {" "}
      <path d="m5 13 4 4L19 7" />{" "}
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {" "}
      <path d="M3 12a9 9 0 1 0 3-6.7" /> <path d="M3 4v5h5" />{" "}
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {" "}
      <path d="M6 6l12 12M18 6 6 18" />{" "}
    </svg>
  );
}
function ActionCard({ title, description, active, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition duration-200 ${active ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-900"}`}
    >
      {" "}
      <div className="mb-3 flex items-center justify-between">
        {" "}
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-current/15 bg-white/60 dark:bg-slate-900/60">
          {" "}
          {icon}{" "}
        </span>{" "}
        {active ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
            {" "}
            <CheckIcon />{" "}
          </span>
        ) : null}{" "}
      </div>{" "}
      <p className="text-sm font-semibold">{title}</p>{" "}
      <p className="mt-1 text-xs leading-relaxed opacity-80">
        {description}
      </p>{" "}
    </button>
  );
}
function SectionTitle({ children }) {
  return (
    <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
      {" "}
      {children}{" "}
    </h3>
  );
}
export default function AccessibilityWidget() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLanguage();
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    setHydrated(true);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      }
    } catch {}
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
    const root = document.documentElement;
    const body = document.body;
    root.style.setProperty("--a11y-font-scale", String(settings.fontScale));
    body.classList.toggle("a11y-high-contrast", settings.highContrast);
    body.classList.toggle("a11y-underline-links", settings.underlineLinks);
    body.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
    body.classList.toggle("a11y-dyslexia-font", settings.dyslexiaFont);
    body.classList.toggle("a11y-big-cursor", settings.bigCursor);
    return () => {
      body.classList.remove("a11y-high-contrast");
      body.classList.remove("a11y-underline-links");
      body.classList.remove("a11y-reduce-motion");
      body.classList.remove("a11y-dyslexia-font");
      body.classList.remove("a11y-big-cursor");
    };
  }, [hydrated, settings]);
  useEffect(() => {
    if (!hydrated) return;
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [hydrated, open]);
  const fontPercent = useMemo(
    () => `${Math.round(settings.fontScale * 100)}%`,
    [settings.fontScale],
  );
  function updateSetting(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }
  function toggleSetting(key) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  function increaseFont() {
    setSettings((prev) => ({
      ...prev,
      fontScale: Math.min(1.3, Number((prev.fontScale + 0.1).toFixed(1))),
    }));
  }
  function decreaseFont() {
    setSettings((prev) => ({
      ...prev,
      fontScale: Math.max(0.9, Number((prev.fontScale - 0.1).toFixed(1))),
    }));
  }
  function resetAll() {
    setSettings(DEFAULT_SETTINGS);
  }
  function setLightTheme() {
    if (theme === "dark") toggleTheme();
  }
  function setDarkTheme() {
    if (theme !== "dark") toggleTheme();
  }
  if (!hydrated) {
    return null;
  }
  return (
    <>
      {" "}
      <div className="group fixed bottom-5 left-5 z-[70]">
        {" "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu aksesibilitas"
          aria-expanded={open}
          aria-controls="accessibility-panel"
          title="Aksesibilitas"
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-[0_16px_40px_rgba(5,150,105,0.35)] transition duration-200 hover:scale-[1.03] hover:from-emerald-700 hover:to-emerald-800"
        >
          {" "}
          <AccessibilityIcon />{" "}
        </button>{" "}
        <div className="pointer-events-none absolute bottom-[72px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-white dark:text-slate-900">
          {" "}
          Menu aksesibilitas{" "}
        </div>{" "}
      </div>{" "}
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Tutup menu aksesibilitas"
        className={`fixed inset-0 z-[71] bg-slate-950/45 backdrop-blur-[3px] transition duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />{" "}
      <aside
        id="accessibility-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu aksesibilitas"
        className={`fixed left-4 top-4 z-[72] flex h-[calc(100vh-2rem)] w-[min(460px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] transition duration-300 ease-out dark:border-slate-800 dark:bg-slate-950 ${open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-3 scale-[0.98] opacity-0"}`}
      >
        {" "}
        <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-5 py-5 text-white dark:border-slate-800">
          {" "}
          <div className="flex items-start justify-between gap-4">
            {" "}
            <div className="flex items-start gap-3">
              {" "}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
                {" "}
                <Image
                  src={siteInfo.logoSrc}
                  alt={siteInfo.shortName}
                  width={30}
                  height={30}
                  className="h-8 w-8 object-contain"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <div className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]">
                  {" "}
                  Accessibility{" "}
                </div>{" "}
                <h2 className="text-xl font-bold leading-tight">
                  {" "}
                  Menu Aksesibilitas{" "}
                </h2>{" "}
                <p className="mt-1 max-w-[280px] text-sm text-white/85">
                  {" "}
                  Atur bahasa, tema, ukuran teks, dan kenyamanan membaca sesuai
                  kebutuhan pengguna.{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-sm font-medium text-white transition hover:bg-white/15"
              >
                {" "}
                <ResetIcon /> Reset{" "}
              </button>{" "}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Tutup panel aksesibilitas"
              >
                {" "}
                <CloseIcon />{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {" "}
          <div
            className={`transition duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          >
            {" "}
            <section className="mb-6">
              {" "}
              <SectionTitle>Bahasa</SectionTitle>{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <button
                  type="button"
                  onClick={() => setLocale("id")}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${locale === "id" ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"}`}
                >
                  {" "}
                  <div className="mb-2 flex items-center gap-2">
                    {" "}
                    <GlobeIcon /> Indonesia{" "}
                  </div>{" "}
                  <p className="text-xs font-medium opacity-80">
                    {" "}
                    Gunakan tampilan Bahasa Indonesia{" "}
                  </p>{" "}
                </button>{" "}
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${locale === "en" ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"}`}
                >
                  {" "}
                  <div className="mb-2 flex items-center gap-2">
                    {" "}
                    <GlobeIcon /> English{" "}
                  </div>{" "}
                  <p className="text-xs font-medium opacity-80">
                    {" "}
                    Switch interface language to English{" "}
                  </p>{" "}
                </button>{" "}
              </div>{" "}
            </section>{" "}
            <section className="mb-6">
              {" "}
              <SectionTitle>Tema</SectionTitle>{" "}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                <button
                  type="button"
                  onClick={setLightTheme}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${theme !== "dark" ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"}`}
                >
                  {" "}
                  <div className="mb-2 flex items-center gap-2">
                    {" "}
                    <SunIcon /> Tema Terang{" "}
                  </div>{" "}
                  <p className="text-xs font-medium opacity-80">
                    {" "}
                    Tampilan terang untuk penggunaan umum{" "}
                  </p>{" "}
                </button>{" "}
                <button
                  type="button"
                  onClick={setDarkTheme}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${theme === "dark" ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"}`}
                >
                  {" "}
                  <div className="mb-2 flex items-center gap-2">
                    {" "}
                    <MoonIcon /> Tema Gelap{" "}
                  </div>{" "}
                  <p className="text-xs font-medium opacity-80">
                    {" "}
                    Lebih nyaman untuk kondisi redup{" "}
                  </p>{" "}
                </button>{" "}
              </div>{" "}
            </section>{" "}
            <section className="mb-6">
              {" "}
              <SectionTitle>Ukuran Font</SectionTitle>{" "}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                {" "}
                <div className="mb-4 flex items-center justify-between">
                  {" "}
                  <button
                    type="button"
                    onClick={decreaseFont}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
                    aria-label="Kurangi ukuran font"
                  >
                    {" "}
                    <MinusIcon />{" "}
                  </button>{" "}
                  <div className="text-center">
                    {" "}
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {" "}
                      {fontPercent}{" "}
                    </p>{" "}
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {" "}
                      Skala teks halaman{" "}
                    </p>{" "}
                  </div>{" "}
                  <button
                    type="button"
                    onClick={increaseFont}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700"
                    aria-label="Tambah ukuran font"
                  >
                    {" "}
                    <PlusIcon />{" "}
                  </button>{" "}
                </div>{" "}
                <div className="grid grid-cols-4 gap-2">
                  {" "}
                  {[0.9, 1, 1.1, 1.2].map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => updateSetting("fontScale", scale)}
                      className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${settings.fontScale === scale ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"}`}
                    >
                      {" "}
                      {Math.round(scale * 100)}%{" "}
                    </button>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
            </section>{" "}
            <section className="mb-2">
              {" "}
              <SectionTitle>Penyesuaian Lain</SectionTitle>{" "}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {" "}
                <ActionCard
                  title="Kontras Tinggi"
                  description="Meningkatkan perbedaan warna teks dan latar agar lebih jelas."
                  active={settings.highContrast}
                  onClick={() => toggleSetting("highContrast")}
                  icon={<span className="text-lg font-bold">◐</span>}
                />{" "}
                <ActionCard
                  title="Sorot Tautan"
                  description="Menambahkan garis bawah pada link agar lebih mudah dikenali."
                  active={settings.underlineLinks}
                  onClick={() => toggleSetting("underlineLinks")}
                  icon={<span className="text-lg font-bold">🔗</span>}
                />{" "}
                <ActionCard
                  title="Reduce Motion"
                  description="Mengurangi animasi dan transisi agar tampilan lebih nyaman."
                  active={settings.reduceMotion}
                  onClick={() => toggleSetting("reduceMotion")}
                  icon={<span className="text-lg font-bold">⏸</span>}
                />{" "}
                <ActionCard
                  title="Font Ramah Baca"
                  description="Menggunakan gaya font yang lebih mudah dibaca."
                  active={settings.dyslexiaFont}
                  onClick={() => toggleSetting("dyslexiaFont")}
                  icon={<span className="text-lg font-bold">Aa</span>}
                />{" "}
                <ActionCard
                  title="Kursor Besar"
                  description="Membesarkan tampilan pointer agar mudah diikuti."
                  active={settings.bigCursor}
                  onClick={() => toggleSetting("bigCursor")}
                  icon={<span className="text-lg font-bold">↖</span>}
                />{" "}
              </div>{" "}
            </section>{" "}
          </div>{" "}
        </div>{" "}
      </aside>{" "}
    </>
  );
}
