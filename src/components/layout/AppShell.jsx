"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  const isPortalPage = pathname === "/";

  if (isAdminRoute || isPortalPage) {
    return <main id="konten-utama" className={isAdminRoute ? "bg-slate-100" : ""}>{children}</main>;
  }

  return (
    <>
      <SkipToMainContent />
      <Header />
      <main id="konten-utama" tabIndex={-1} className="min-h-screen pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40">
        {children}
      </main>
      <Footer />
    </>
  );
}

function SkipToMainContent() {
  return (
    <a
      href="#konten-utama"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-emerald-300"
    >
      Lewati ke konten utama
    </a>
  );
}
