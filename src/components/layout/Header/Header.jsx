"use client";

import React from "react";
import Image from "next/image";
import { useHeader } from "@/hooks/useHeader";
import { HeaderSearchForm } from "./HeaderSearchForm";
import { DesktopNav, HeaderControls } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { HeaderLogo, MobileMenuToggle } from "./HeaderUI";

export default function Header() {
  const h = useHeader();

  return (
    <header className="fixed top-0 left-0 right-0 z-100 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:border-white/5 dark:bg-slate-950/70">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between py-2.5 lg:py-4">
          <HeaderLogo />



          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 mr-2 border-r border-slate-200 dark:border-slate-800 pr-6">
              <Image src="/assets/branding/hapakat.png" alt="Hapakat" width={60} height={20} className="h-4 w-auto object-contain opacity-90" style={{ width: "auto" }} />
              <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 leading-tight">
                <span className="text-amber-500">H</span>armonis, <span className="text-amber-500">A</span>manah, <span className="text-amber-500">P</span>rofesional, <span className="text-amber-500">A</span>kuntabel, <span className="text-amber-500">K</span>reatif, <span className="text-amber-500">A</span>dil dan <span className="text-amber-500">T</span>ransparan
              </p>
            </div>
            <HeaderControls 
              locale={h.locale} setLocale={h.setLocale} 
              theme={h.theme} setLightTheme={h.setLightTheme} setDarkTheme={h.setDarkTheme} 
              adminState={h.adminState} 
            />
            <MobileMenuToggle isOpen={h.isMobileMenuOpen} onToggle={h.toggleMobileMenu} />
          </div>
        </div>

        {/* Desktop Navigation Row */}
        <DesktopNav
          navigationItems={h.navigationItems} pathname={h.pathname}
          openDesktopDropdown={h.openDesktopDropdown} toggleDesktopDropdown={h.toggleDesktopDropdown}
          setOpenDesktopDropdown={h.setOpenDesktopDropdown} desktopDropdownRef={h.desktopDropdownRef}
          searchQuery={h.searchQuery} setSearchQuery={h.setSearchQuery}
          handleSearchSubmit={h.handleSearchSubmit} handleSearchKeyDown={h.handleSearchKeyDown}
          handleSearchBlur={h.handleSearchBlur} t={h.t}
          suggestions={h.suggestions} showSuggestions={h.showSuggestions}
          handleSuggestionSelect={h.handleSuggestionSelect} activeSuggestionIndex={h.activeSuggestionIndex}
        />
      </div>

      <MobileNav
        isMobileMenuOpen={h.isMobileMenuOpen} closeMobileMenu={h.closeMobileMenu}
        searchQuery={h.searchQuery} setSearchQuery={h.setSearchQuery}
        handleSearchSubmit={h.handleSearchSubmit} handleSearchKeyDown={h.handleSearchKeyDown}
        handleSearchBlur={h.handleSearchBlur} t={h.t}
        suggestions={h.suggestions} showSuggestions={h.showSuggestions}
        handleSuggestionSelect={h.handleSuggestionSelect} activeSuggestionIndex={h.activeSuggestionIndex}
        locale={h.locale} setLocale={h.setLocale} theme={h.theme}
        setLightTheme={h.setLightTheme} setDarkTheme={h.setDarkTheme}
        navigationItems={h.navigationItems} pathname={h.pathname}
        openMobileDropdown={h.openMobileDropdown} toggleMobileDropdown={h.toggleMobileDropdown}
        adminState={h.adminState}
      />
    </header>
  );
}
