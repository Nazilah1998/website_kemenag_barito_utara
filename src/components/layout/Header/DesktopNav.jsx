import React from "react";
import Link from "next/link";

export function DesktopNav({
  navigationItems,
  pathname,
  openDesktopDropdown,
  toggleDesktopDropdown,
  setOpenDesktopDropdown,
  locale,
  setLocale,
  theme,
  setLightTheme,
  setDarkTheme,
  adminState,
  desktopDropdownRef,
}) {
  return (
    <nav className="hidden border-t border-slate-100/50 py-1 dark:border-white/5 lg:block">
      <div className="flex items-center justify-between">
        <ul className="flex flex-nowrap items-center gap-1" ref={desktopDropdownRef}>
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

                {hasChildren && isOpen && (
                  <div className="absolute left-0 top-full z-50 pt-2 min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-300">
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
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          {/* Controls Group */}
          <div className="flex items-center gap-4 border-r border-slate-200/50 pr-4 dark:border-white/5">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 rounded-full bg-slate-100/50 p-1 ring-1 ring-slate-200/50 dark:bg-white/5 dark:ring-white/10">
              {["id", "en"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`rounded-full px-3 py-1 text-[10px] font-black uppercase transition-all duration-300 ${locale === l
                    ? "bg-white text-emerald-700 shadow-sm dark:bg-emerald-600 dark:text-white"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    }`}
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
          <Link
            href="/admin"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.1em] text-white transition-all hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] active:scale-95"
          >
            <span className="relative z-10">{adminState?.user ? "Panel Admin" : "Login"}</span>
            <div className="absolute inset-0 bg-white/20 transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
          </Link>
        </div>
      </div>
    </nav>
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
