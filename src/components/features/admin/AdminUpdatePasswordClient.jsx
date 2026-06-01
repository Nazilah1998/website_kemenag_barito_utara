"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteInfo } from "@/data/site";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";
import { PasswordInput } from "./login/UpdatePasswordUI";

export default function AdminUpdatePasswordClient() {
  const u = useUpdatePassword();

  if (u.checking) return <UpdatePasswordLoading />;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_30%)]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
          <UpdatePasswordHeader />

          {u.ready ? (
            <form onSubmit={u.handleSubmit} className="mt-8 space-y-5">
              <PasswordInput
                label="Password baru" value={u.password} placeholder="Minimal 8 karakter"
                onChange={(e) => u.setPassword(e.target.value)} show={u.showPassword}
                onToggle={() => u.setShowPassword(!u.showPassword)}
                showStrength={true}
              />
              <PasswordInput
                label="Konfirmasi password baru" value={u.confirmPassword} placeholder="Ulangi password baru"
                onChange={(e) => u.setConfirmPassword(e.target.value)} show={u.showConfirmPassword}
                onToggle={() => u.setShowConfirmPassword(!u.showConfirmPassword)}
              />

              {u.error && <StatusBadge type="error" message={u.error} />}
              {u.success && <StatusBadge type="success" message={u.success} />}

              <button
                type="submit" disabled={u.submitting || !u.password || !u.confirmPassword}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {u.submitting ? "Menyimpan..." : "Simpan password baru"}
              </button>
            </form>
          ) : (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
              Sesi reset password belum siap. Silakan minta tautan reset baru.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function UpdatePasswordLoading() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
        <p className="text-sm font-medium text-slate-700">Memeriksa sesi reset password...</p>
      </div>
    </section>
  );
}

function UpdatePasswordHeader() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={44} height={44} unoptimized />
          <div>
            <p className="text-sm font-bold text-slate-900">{siteInfo.shortName}</p>
            <p className="text-xs text-slate-500">Panel Admin</p>
          </div>
        </Link>
        <Link href="/admin/login" className="inline-flex items-center rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Login</Link>
      </div>
      <div className="mt-8">
        <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Update Password</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Buat password baru</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">Masukkan password baru untuk akun Anda.</p>
      </div>
    </>
  );
}

function StatusBadge({ type, message }) {
  const classes = type === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-50 text-rose-700";
  return <div className={`rounded-2xl border px-4 py-3 text-sm ${classes}`}>{message}</div>;
}
