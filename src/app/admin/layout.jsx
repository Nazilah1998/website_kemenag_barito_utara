"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminShell from "@/components/layout/Admin/AdminShell";

const AUTH_PATHS = new Set([
  "/admin/login",
  "/admin/forgot-password",
  "/admin/register-editor",
  "/admin/update-password",
]);

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Login, forgot password, etc. should never have the shell
  const isExplicitAuthPage = AUTH_PATHS.has(pathname);

  // For the root /admin, we show the shell only if it's NOT a login view
  // But since the page handles the view, we can't easily know here.
  // HOWEVER, AdminShell itself has a loading state and redirects.

  if (isExplicitAuthPage) {
    return <div className="admin-auth-wrapper">{children}</div>;
  }

  return <AdminShell>{children}</AdminShell>;
}