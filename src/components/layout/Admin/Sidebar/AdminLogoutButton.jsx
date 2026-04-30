"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-[0.25em] italic text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-white dark:text-black dark:hover:bg-slate-200"
    >
      <span className="relative z-10">{loading ? "Memproses..." : "Keluar Sesi"}</span>
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
    </button>
  );
}
