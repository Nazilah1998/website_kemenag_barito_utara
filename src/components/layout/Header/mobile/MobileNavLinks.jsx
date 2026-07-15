import React from "react";
import Link from "next/link";

export function MobileNavLinks({
  navigationItems,
  pathname,
  onNavigate,
  openMobileDropdown,
  toggleMobileDropdown,
}) {
  return (
    <nav className="px-6 py-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Navigasi Utama</p>
      <ul className="space-y-1">
        {navigationItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openMobileDropdown[item.label];
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <li key={item.label} className="block">
              <div
                className={`flex items-center justify-between rounded-2xl transition-all duration-200 ${isOpen ? "bg-slate-50 dark:bg-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-800" : ""}`}
              >
                {hasChildren ? (
                  <div
                    onClick={() => toggleMobileDropdown(item.label)}
                    className={`flex-1 cursor-pointer px-4 py-3.5 text-sm font-bold transition-colors ${active ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
                  >
                    {item.label}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`flex-1 px-4 py-3.5 text-sm font-bold transition-colors ${active ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
                  >
                    {item.label}
                  </Link>
                )}

                {hasChildren && (
                  <button
                    onClick={() => toggleMobileDropdown(item.label)}
                    className={`group flex items-center justify-center w-14 self-stretch border-l border-transparent transition-all ${isOpen ? "border-slate-200 dark:border-slate-800" : ""}`}
                    aria-label={isOpen ? "Tutup sub-menu" : "Buka sub-menu"}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all group-active:scale-90 ${isOpen ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                )}
              </div>

              {hasChildren && isOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l-2 border-slate-100 py-1 pl-4 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-200">
                  {item.children.map((child) => {
                    const hasSubChildren = child.children && child.children.length > 0;
                    const isSubOpen = openMobileDropdown[child.label];

                    return (
                      <li key={child.label} className="block">
                        <div className={`flex items-center justify-between rounded-xl transition-all duration-200 ${isSubOpen ? "bg-slate-50 dark:bg-slate-900/50" : ""}`}>
                          {hasSubChildren ? (
                            <div
                              onClick={() => toggleMobileDropdown(child.label)}
                              className={`flex-1 cursor-pointer px-4 py-3 text-xs font-bold transition-colors ${pathname === child.href ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
                            >
                              {child.label}
                            </div>
                          ) : (
                            <Link
                              href={child.href} onClick={onNavigate}
                              {...(child.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className={`flex-1 px-4 py-3 text-xs font-bold transition-colors ${pathname === child.href ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"}`}
                            >
                              {child.label}
                            </Link>
                          )}
                          
                          {hasSubChildren && (
                            <button
                              onClick={() => toggleMobileDropdown(child.label)}
                              className={`flex items-center justify-center w-10 self-stretch transition-all`}
                            >
                              <ChevronDownIcon className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${isSubOpen ? "rotate-180 text-emerald-500" : ""}`} />
                            </button>
                          )}
                        </div>

                        {hasSubChildren && isSubOpen && (
                          <ul className="mt-1 ml-4 space-y-1 border-l border-slate-100 py-1 pl-3 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-200">
                            {child.children.map((subChild) => (
                              <li key={subChild.label}>
                                <Link
                                  href={subChild.href} onClick={onNavigate}
                                  {...(subChild.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                  className={`block rounded-xl px-4 py-2.5 text-[11px] font-bold transition-colors ${pathname === subChild.href ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"}`}
                                >
                                  {subChild.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
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
