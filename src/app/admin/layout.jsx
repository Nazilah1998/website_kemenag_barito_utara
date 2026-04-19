"use client";

import { usePathname } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

const AUTH_PATHS = new Set([
  "/admin/login",
  "/admin/forgot-password",
  "/admin/register-editor",
]);

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (AUTH_PATHS.has(pathname)) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}