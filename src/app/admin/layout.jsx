"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthLikePage =
    pathname === "/admin/login" || pathname === "/admin/mfa";

  if (isAuthLikePage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[288px] transform border-r border-slate-200 bg-white px-4 py-5 transition duration-300 lg:static lg:z-auto lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <AdminSidebar onNavigate={() => setMobileOpen(false)} />
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Tutup sidebar"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <AdminHeader onOpenSidebar={() => setMobileOpen(true)} />
        </header>

        <main className="min-w-0 px-4 py-6 md:px-6 xl:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}