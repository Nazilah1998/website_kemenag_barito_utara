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
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <AdminHeader onOpenSidebar={() => setMobileOpen(true)} />

        <main className="min-w-0 px-4 py-6 md:px-6 xl:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}