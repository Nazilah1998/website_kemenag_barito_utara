import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MobileNavHeader } from "./mobile/MobileNavHeader";
import { MobileNavSearch } from "./mobile/MobileNavSearch";
import { MobileNavLinks } from "./mobile/MobileNavLinks";
import { MobileNavUtilities } from "./mobile/MobileNavUtilities";

export function MobileNav({
  isMobileMenuOpen,
  closeMobileMenu,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  handleSearchKeyDown,
  handleSearchBlur,
  t,
  suggestions,
  showSuggestions,
  handleSuggestionSelect,
  activeSuggestionIndex,
  locale,
  setLocale,
  theme,
  setLightTheme,
  setDarkTheme,
  navigationItems,
  pathname,
  openMobileDropdown,
  toggleMobileDropdown,
  adminState,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Backdrop: Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Drawer: Slide dari kanan dengan spring */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 bottom-0 w-[300px] max-w-[85vw] flex flex-col bg-white dark:bg-slate-950 shadow-2xl"
            style={{ isolation: "isolate" }}
          >
            <MobileNavHeader onClose={closeMobileMenu} />

            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
              <MobileNavSearch
                query={searchQuery}
                setQuery={setSearchQuery}
                onSubmit={handleSearchSubmit}
                onKeyDown={handleSearchKeyDown}
                onBlur={handleSearchBlur}
                t={t}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                onSelectSuggestion={handleSuggestionSelect}
                activeIndex={activeSuggestionIndex}
              />

              <MobileNavLinks
                navigationItems={navigationItems}
                pathname={pathname}
                onNavigate={closeMobileMenu}
                openMobileDropdown={openMobileDropdown}
                toggleMobileDropdown={toggleMobileDropdown}
              />
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/50">
              <MobileNavUtilities
                locale={locale}
                setLocale={setLocale}
                theme={theme}
                setLightTheme={setLightTheme}
                setDarkTheme={setDarkTheme}
                adminState={adminState}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
