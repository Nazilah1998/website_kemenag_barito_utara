import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import { SearchIcon, CloseIcon } from "./HeaderIcons";
import { motion, AnimatePresence } from "framer-motion";

export function HeaderSearchForm({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  onBlur,
  placeholder,
  buttonLabel,
  suggestions = [],
  showSuggestions = false,
  onSelectSuggestion,
  listboxId = "search-listbox",
  activeIndex = -1,
  collapsible = false,
}) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Adjust state during render phase if route changes (avoiding useEffect warning)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (collapsible) {
      setIsExpanded(false);
    }
  }

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current && collapsible) {
      inputRef.current.focus();
    }
  }, [isExpanded, collapsible]);

  // Reset search query when collapsed/closed
  const prevExpandedRef = useRef(isExpanded);
  useEffect(() => {
    if (collapsible && prevExpandedRef.current && !isExpanded && value) {
      if (onChange) {
        onChange({ target: { value: "" } });
      }
    }
    prevExpandedRef.current = isExpanded;
  }, [isExpanded, collapsible, value, onChange]);

  // Click outside listener (always collapses when clicking outside)
  useEffect(() => {
    if (!collapsible) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapsible]);

  // Keyboard shortcut listener to open search when '/' is pressed
  useEffect(() => {
    if (!collapsible) return;
    const handleGlobalKeyDown = (e) => {
      if (
        e.key === "/" &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA" &&
        !document.activeElement.isContentEditable
      ) {
        e.preventDefault();
        setIsExpanded(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [collapsible]);

  // Handle local keydown to close on Escape
  const handleKeyDownLocal = (e) => {
    if (e.key === "Escape") {
      setIsExpanded(false);
      inputRef.current?.blur();
    }
    if (onKeyDown) onKeyDown(e);
  };

  if (!collapsible) {
    return (
      <div
        className="relative w-full search-container"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={showSuggestions && suggestions.length > 0}
        aria-controls={
          showSuggestions && suggestions.length > 0 ? listboxId : undefined
        }
      >
        <form onSubmit={onSubmit} className="relative group flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600 dark:text-slate-500 dark:group-focus-within:text-emerald-400">
            <SearchIcon className="h-4.5 w-4.5" />
          </div>

          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setTimeout(() => setIsFocused(false), 200);
              if (onBlur) onBlur(e);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder || t("header.searchPlaceholder")}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-100/50 pl-11 pr-12 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-emerald-500 dark:focus:bg-slate-800 dark:focus:ring-emerald-500/10"
            aria-autocomplete="list"
            aria-controls={
              isFocused && showSuggestions && suggestions.length > 0 ? listboxId : undefined
            }
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1">
            <kbd className="flex h-5 items-center rounded border border-slate-200 bg-white px-1.5 font-sans text-[10px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              /
            </kbd>
          </div>
        </form>

        <AnimatePresence>
          {isFocused && showSuggestions && suggestions.length > 0 && (
            <motion.div
              id={listboxId}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="absolute z-[50] mt-3 w-full sm:w-[450px] sm:-right-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("searchPage.title")}
              </div>
              <ul role="listbox" className="space-y-0.5">
                {suggestions.map((item, index) => (
                  <li
                    key={item.id || index}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseDown={() => {
                      setIsExpanded(false);
                      onSelectSuggestion(item);
                    }}
                    onTouchStart={() => {
                      setIsExpanded(false);
                      onSelectSuggestion(item);
                    }}
                    className={`group flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-all ${
                      index === activeIndex
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${index === activeIndex ? "bg-white/20" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}
                    >
                      <SectionIcon section={item.section} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`truncate text-sm font-bold ${index === activeIndex ? "text-white" : "text-slate-900 dark:text-slate-100"}`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded ${index === activeIndex ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200"}`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 line-clamp-1 text-[11px] ${index === activeIndex ? "text-white/80" : "text-slate-500 dark:text-slate-200"}`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      className="relative search-container flex items-center justify-end w-10 h-10"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={showSuggestions && suggestions.length > 0}
      aria-controls={
        showSuggestions && suggestions.length > 0 ? listboxId : undefined
      }
    >
      <AnimatePresence initial={false}>
        {!isExpanded ? (
          <motion.button
            key="search-trigger"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12 }}
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-emerald-400"
            aria-label="Open Search"
          >
            <SearchIcon className="h-5 w-5" />
          </motion.button>
        ) : (
          <motion.div
            key="search-floating-panel"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="absolute right-0 top-full mt-3.5 z-50 flex items-center w-[290px] sm:w-[380px] md:w-[450px] h-11 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl pl-4 pr-1.5"
          >
            {/* Decorative pointer arrow */}
            <div className="absolute right-3.5 -top-1.5 w-3 h-3 rotate-45 bg-white/95 border-l border-t border-slate-200/80 dark:bg-slate-900/95 dark:border-slate-800/80" />
            <form
              onSubmit={(e) => {
                setIsExpanded(false);
                onSubmit(e);
              }}
              className="flex flex-1 items-center gap-2.5 h-full"
            >
              <div className="text-slate-400 dark:text-slate-500">
                <SearchIcon className="h-4.5 w-4.5" />
              </div>

              <input
                ref={inputRef}
                type="search"
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                  setTimeout(() => setIsFocused(false), 200);
                  if (onBlur) onBlur(e);
                }}
                onKeyDown={handleKeyDownLocal}
                placeholder={placeholder || t("header.searchPlaceholder")}
                className="header-search-input h-full flex-1 bg-transparent text-sm font-medium text-slate-900 border-none outline-none focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none ring-0 placeholder:text-slate-400 dark:text-slate-100"
                aria-autocomplete="list"
                aria-controls={
                  isFocused && showSuggestions && suggestions.length > 0 ? listboxId : undefined
                }
              />

              <div className="flex items-center gap-1.5">
                <kbd className="hidden sm:flex h-5 items-center rounded border border-slate-200 bg-slate-50 px-1.5 font-sans text-[9px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800/50">
                  ESC
                </kbd>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                  aria-label="Close Search"
                >
                  <CloseIcon className="h-4.5 w-4.5" />
                </button>
              </div>
            </form>

            <AnimatePresence>
              {isFocused && showSuggestions && suggestions.length > 0 && (
                <motion.div
                  id={listboxId}
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="absolute z-[50] left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t("searchPage.title")}
                  </div>
                  <ul role="listbox" className="space-y-0.5">
                    {suggestions.map((item, index) => (
                      <li
                        key={item.id || index}
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseDown={() => {
                          setIsExpanded(false);
                          onSelectSuggestion(item);
                        }}
                        onTouchStart={() => {
                          setIsExpanded(false);
                          onSelectSuggestion(item);
                        }}
                        className={`group flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-all ${
                          index === activeIndex
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${index === activeIndex ? "bg-white/20" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"}`}
                        >
                          <SectionIcon section={item.section} className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`truncate text-sm font-bold ${index === activeIndex ? "text-white" : "text-slate-900 dark:text-slate-100"}`}
                            >
                              {item.title}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded ${index === activeIndex ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200"}`}
                            >
                              {item.category}
                            </span>
                          </div>
                          <p
                            className={`mt-0.5 line-clamp-1 text-[11px] ${index === activeIndex ? "text-white/80" : "text-slate-500 dark:text-slate-200"}`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionIcon({ section, className }) {
  // Simple icon selector based on section
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {section === "Berita" && (
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      )}
      {section === "Layanan" && (
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
      )}
      {section === "Profil" && (
        <>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      )}
      {section === "Navigasi" && (
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      )}
      {(!section ||
        !["Berita", "Layanan", "Profil", "Navigasi"].includes(section)) && (
        <circle cx="12" cy="12" r="10" />
      )}
    </svg>
  );
}
