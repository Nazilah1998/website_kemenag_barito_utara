import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { HeaderSearchForm } from "./HeaderSearchForm";

export function DesktopNav({
  navigationItems,
  pathname,
  openDesktopDropdown,
  toggleDesktopDropdown,
  setOpenDesktopDropdown,
  desktopDropdownRef,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  handleSearchKeyDown,
  handleSearchBlur,
  t,
  suggestions,
  showSuggestions,
  handleSuggestionSelect,
  activeSuggestionIndex
}) {
  return (
    <nav className="hidden border-t border-slate-100/50 py-2.5 dark:border-white/5 lg:block">
      <div className="flex items-center justify-end">
        <ul className="flex flex-nowrap items-center justify-start gap-3 xl:gap-6 mr-6" ref={desktopDropdownRef}>
          {navigationItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDesktopDropdown === item.label;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => hasChildren && setOpenDesktopDropdown(item.label)}
                onMouseLeave={() => hasChildren && setOpenDesktopDropdown(null)}
              >
                {hasChildren ? (
                  <div
                    className={`group inline-flex cursor-default flex-shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-black uppercase tracking-tight transition-all duration-300 ${active
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      }`}
                  >
                    {item.label}
                    <ChevronDownIcon className={`h-3 w-3 transition-transform duration-500 ${isOpen ? "rotate-180 text-emerald-500" : "text-slate-400"}`} />

                    {/* Active Indicator Underline */}
                    {active && (
                      <div className="absolute bottom-0 left-4 right-8 h-0.5 rounded-full bg-emerald-500/50" />
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`relative inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-black uppercase tracking-tight transition-all duration-300 ${active
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                      }`}
                  >
                    {item.label}
                    {active && (
                      <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-emerald-500" />
                    )}
                  </Link>
                )}

                <AnimatePresence>
                  {hasChildren && isOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                      className="absolute left-0 top-full z-50 pt-2 min-w-[240px]"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
                        {/* Decorative Background for Dropdown */}
                        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl" />

                        <ul className="relative z-10 space-y-0.5">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="group/item flex items-center justify-between rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-emerald-600 hover:text-white dark:text-slate-400 dark:hover:bg-emerald-600 dark:hover:text-white"
                              >
                                <span>{child.label}</span>
                                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 opacity-0 transition-all -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0" stroke="currentColor" strokeWidth="3">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center pl-4 border-l border-slate-200/50 dark:border-white/5">
          <HeaderSearchForm
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={handleSearchSubmit} onKeyDown={handleSearchKeyDown}
            onBlur={handleSearchBlur} placeholder={t("header.searchPlaceholder")}
            buttonLabel={t("common.search")} suggestions={suggestions}
            showSuggestions={showSuggestions} onSelectSuggestion={handleSuggestionSelect}
            listboxId="desktop-nav-search-listbox" activeIndex={activeSuggestionIndex}
            collapsible={true}
          />
        </div>
      </div>
    </nav>
  );
}

export function HeaderControls({ locale, setLocale, theme, setLightTheme, setDarkTheme, adminState }) {
  return (
    <div className="hidden lg:flex items-center gap-4">
      {/* Controls Group */}
      <div className="flex items-center gap-4 border-r border-slate-200/50 pr-4 dark:border-white/5">
        {/* Language Switcher */}
        <div className="flex items-center gap-1 rounded-full bg-slate-100/50 p-1 ring-1 ring-slate-200/50 dark:bg-white/5 dark:ring-white/10">
          {["id", "en"].map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase transition-all duration-300 ${locale === l ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"}`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center gap-1 rounded-full bg-slate-100/50 p-1 ring-1 ring-slate-200/50 dark:bg-white/5 dark:ring-white/10">
          <button
            onClick={setLightTheme}
            className={`rounded-full p-1.5 transition-all duration-300 ${theme === "light" ? "bg-white text-amber-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            aria-label="Light Mode"
          >
            <SunIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={setDarkTheme}
            className={`rounded-full p-1.5 transition-all duration-300 ${theme === "dark" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            aria-label="Dark Mode"
          >
            <MoonIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Admin Link / Login */}
      <AdminLoginButton adminState={adminState} />
    </div>
  );
}

function AdminLoginButton({ adminState }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  if (adminState?.user) {
    return (
      <Link
        href="/admin"
        className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.1em] text-white transition-all hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] active:scale-95"
      >
        <span className="relative z-10">Panel Admin</span>
        <div className="absolute inset-0 bg-white/20 transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
      </Link>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => { setHasBeenOpened(true); setShowConfirm(true); }}
        className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.1em] text-white transition-all hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] active:scale-95"
      >
        <span className="relative z-10">Login Admin</span>
        <div className="absolute inset-0 bg-white/20 transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
      </button>

      {/* Confirmation Modal via Portal */}
      {hasBeenOpened && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
                onClick={() => setShowConfirm(false)}
              />

              {/* Modal Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-200/50 dark:bg-slate-900/95 dark:ring-white/10 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
              >
                {/* Top red warning accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 w-full bg-gradient-to-r from-rose-600 via-red-500 to-rose-600" />
                
                {/* Decorative Background */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

                <div className="relative p-8 z-10">
                  <div className="flex flex-col items-center text-center">
                    {/* Glowing Warning Icon */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-b from-red-50 to-rose-100/50 dark:from-red-950/50 dark:to-rose-900/20 ring-1 ring-red-500/20 shadow-inner">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-10 w-10 text-red-600 dark:text-red-400 animate-[pulse_1.5s_ease-in-out_infinite]"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                      Peringatan Akses
                    </h3>

                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-[280px]">
                      Halaman ini dikhususkan bagi <strong className="font-bold text-red-600 dark:text-red-400">Admin Kemenag Barito Utara</strong>.
                    </p>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white py-3.5 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-white/20 active:scale-95"
                    >
                      Kembali
                    </button>
                    <Link
                      href="/admin"
                      onClick={() => setShowConfirm(false)}
                      className="group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 py-3.5 text-center text-[11px] font-black uppercase tracking-widest text-white transition-all hover:shadow-[0_8px_20px_-6px_rgba(225,29,72,0.5)] active:scale-95"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Ya, Masuk
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                      <div className="absolute inset-0 bg-white/20 transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SunIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
