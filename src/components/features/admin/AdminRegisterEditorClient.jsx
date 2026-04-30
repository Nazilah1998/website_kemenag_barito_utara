"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteInfo } from "@/data/site";
import { useRegisterEditor } from "@/hooks/useRegisterEditor";
import { RegisterInput, RegisterSelect, RegisterPasswordInput, UNIT_KERJA_OPTIONS } from "./login/RegisterEditorUI";

export default function AdminRegisterEditorClient() {
  const r = useRegisterEditor();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      {/* Decorative Elements */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/5" />

      <div className="relative w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        <div className="rounded-[2.5rem] border-2 border-white bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/90 sm:p-10">
          <RegisterHeader />

          <form onSubmit={r.handleSubmit} className="mt-8 space-y-4" autoComplete="off">
            <RegisterInput label="Nama Lengkap Personil" value={r.fullName} onChange={(e) => r.setFullName(e.target.value)} placeholder="Contoh: Muhammad Nazilah, S.E" />
            <RegisterInput label="Alamat Email Resmi" type="email" value={r.email} onChange={(e) => r.setEmail(e.target.value)} placeholder="nama@email.com" />
            <RegisterSelect label="Unit Kerja / Bidang" value={r.unitName} onChange={(e) => r.setUnitName(e.target.value)} options={UNIT_KERJA_OPTIONS} />
            <RegisterPasswordInput value={r.password} onChange={(e) => r.setPassword(e.target.value)} show={r.showPassword} onToggle={() => r.setShowPassword(!r.showPassword)} />

            <div className="pt-1">
              {r.error && <StatusAlert type="error" message={r.error} />}
              {r.success && <StatusAlert type="success" message={r.success} />}
            </div>

            <button
              type="submit"
              disabled={r.submitting || !r.fullName || !r.email || !r.password}
              className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-xs font-black uppercase tracking-[0.25em] italic text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-white dark:text-black dark:hover:bg-slate-200"
            >
              <span className="relative z-10">{r.submitting ? "Memproses..." : "Daftarkan Akun"}</span>
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/5">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-[9px] font-bold leading-relaxed text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] italic">
                Akun <span className="text-slate-900 dark:text-white">Editor</span> memerlukan verifikasi keamanan dari Super Admin sebelum dapat digunakan.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
            © {new Date().getFullYear()} {siteInfo.shortName} · Secure System
          </p>
        </div>
      </div>
    </section>
  );
}

function RegisterHeader() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="transition-transform hover:scale-110">
          <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={56} height={56} priority className="drop-shadow-xl" />
        </Link>
        <div className="h-10 w-px bg-slate-100 dark:bg-white/5" />
        <div className="text-left">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 italic mb-1">
            Gatekeeper Access
          </p>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
            Buat Akun <span className="text-emerald-600 dark:text-emerald-400">Editor</span>
          </h1>
        </div>
      </div>

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 dark:border-white/5 dark:bg-white/5">
        <div className="h-1 w-1 rounded-full bg-slate-400 animate-pulse" />
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Otorisasi Khusus Personil Internal</span>
      </div>

      <p className="text-[11px] font-medium text-slate-400">
        Sudah memiliki akses? <Link href="/admin/login" className="font-black text-slate-900 underline dark:text-white">Masuk di sini</Link>
      </p>
    </div>
  );
}

function StatusAlert({ type, message }) {
  const isSuccess = type === "success";
  return (
    <div className={`flex items-start gap-3 rounded-2xl border-2 p-4 animate-in slide-in-from-top-2 ${isSuccess ? "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400" : "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400"}`}>
      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isSuccess ? "bg-emerald-500" : "bg-rose-500"} text-white`}>
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="4">
          <path d={isSuccess ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
        </svg>
      </div>
      <p className="text-xs font-bold leading-relaxed">{message}</p>
    </div>
  );
}