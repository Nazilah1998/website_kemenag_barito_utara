import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [portalMounted, setPortalMounted] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const id = setTimeout(() => setPortalMounted(true), 0);
      return () => clearTimeout(id);
    }
  }, [isMobileMenuOpen]);

  if (!portalMounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop: Animasi Fade-in/out */}
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeMobileMenu}
      />

      {/* Drawer Container: Animasi Slide-in/out */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-[300px] max-w-[85vw] flex flex-col bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
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
          </div>
        </div>,
    document.body
  );
}


