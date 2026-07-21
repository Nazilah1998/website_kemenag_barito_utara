import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { HeaderSearchForm } from "./HeaderSearchForm";
import { Lock } from "lucide-react";

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
          {navigationItems.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDesktopDropdown === item.label;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li
                key={`nav-${idx}-${item.href || item.label}`}
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
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
                      className={`absolute top-full z-50 pt-2 min-w-[240px] ${
                        ['Laporan', 'Zona Integritas', 'Report', 'Integrity Zone'].includes(item.label) ? 'right-0' : 'left-0'
                      }`}
                    >
                      <div className="relative rounded-2xl border border-slate-200/60 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
                        {/* Decorative Background for Dropdown */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl" />
                        </div>

                        <ul className="relative z-10 space-y-0.5">
                          {item.children.map((child, cIdx) => {
                            const hasSubChildren = child.children && child.children.length > 0;
                            return (
                              <li key={`child-${cIdx}-${child.href || child.label}`} className="relative group/sub">
                                {hasSubChildren ? (
                                  <>
                                    <div className="group/item flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-emerald-600 hover:text-white dark:text-slate-400 dark:hover:bg-emerald-600 dark:hover:text-white">
                                      <span>{child.label}</span>
                                      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 opacity-50 transition-all group-hover/item:opacity-100" stroke="currentColor" strokeWidth="3">
                                        <path d="M9 18l6-6-6-6" />
                                      </svg>
                                    </div>
                                    <div className="absolute left-full top-0 pl-3 hidden opacity-0 group-hover/sub:block group-hover/sub:opacity-100 transition-opacity z-50">
                                      <div className="w-[240px] overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
                                        <ul className="space-y-0.5">
                                          {child.children.map((subChild, scIdx) => (
                                            <li key={`sub-${scIdx}-${subChild.href || subChild.label}`}>
                                              <Link
                                                href={subChild.href}
                                                {...(subChild.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                                className="group/subitem flex items-center justify-between rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-emerald-600 hover:text-white dark:text-slate-400 dark:hover:bg-emerald-600 dark:hover:text-white"
                                              >
                                                <span>{subChild.label}</span>
                                                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 opacity-0 transition-all -translate-x-2 group-hover/subitem:opacity-100 group-hover/subitem:translate-x-0" stroke="currentColor" strokeWidth="3">
                                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <Link
                                    href={child.href}
                                    {...(child.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                    className="group/item flex items-center justify-between rounded-xl px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-emerald-600 hover:text-white dark:text-slate-400 dark:hover:bg-emerald-600 dark:hover:text-white"
                                  >
                                    <span>{child.label}</span>
                                    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 opacity-0 transition-all -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0" stroke="currentColor" strokeWidth="3">
                                      <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                  </Link>
                                )}
                              </li>
                            );
                          })}
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
          {[
            { id: "id", label: "ID", flag: (
              <svg className="w-3.5 h-3.5 rounded-full overflow-hidden shadow-sm shrink-0" viewBox="0 0 640 480">
                <g fillRule="evenodd" strokeWidth="1pt">
                  <path fill="#e70011" d="M0 0h640v240H0z"/>
                  <path fill="#fff" d="M0 240h640v240H0z"/>
                </g>
              </svg>
            )},
            { id: "en", label: "EN", flag: (
              <svg className="w-3.5 h-3.5 rounded-full overflow-hidden shadow-sm shrink-0" viewBox="0 0 640 480">
                <path fill="#012169" d="M0 0h640v480H0z"/>
                <path fill="#FFF" d="m75 0 245 180L565 0h75v55L395 240l245 185v55h-75L320 300 75 480H0v-55l245-185L0 55V0h75z"/>
                <path fill="#C8102E" d="m400 290 170 130h70v-20L440 270l-40 20zM240 190 70 60H0v20l200 130 40-20zm0 100L40 420H0v20l200-130 40 10zm160-100L570 60h70V40L440 170l-40 20z"/>
                <path fill="#FFF" d="M240 0v480h160V0H240zM0 160v160h640V160H0z"/>
                <path fill="#C8102E" d="M267 0v480h106V0H267zM0 187v106h640V187H0z"/>
              </svg>
            )}
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setLocale(item.id)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase transition-all duration-300 ${locale === item.id ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"}`}
            >
              {item.flag}
              <span>{item.label}</span>
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
                className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
              >
                {/* Decorative background accent */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <Lock className="h-7 w-7 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                  </div>

                  <h3 className="mb-2 text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Akses Terbatas
                  </h3>

                  <div className="mb-8 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <p>Halaman ini dikhususkan bagi</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">Admin Kemenag Barito Utara.</p>
                  </div>

                  <div className="flex w-full gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 rounded-xl bg-slate-100 py-3.5 text-[11px] font-black uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Batal
                    </button>
                    <Link
                      href="/admin"
                      onClick={() => setShowConfirm(false)}
                      className="group relative flex-1 overflow-hidden rounded-xl bg-slate-900 py-3.5 text-center text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Masuk
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
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
