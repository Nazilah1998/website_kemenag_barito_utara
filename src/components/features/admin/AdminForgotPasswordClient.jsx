"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteInfo } from "@/data/site";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { inputClassName, EyeIcon } from "./login/LoginUI";

export default function AdminForgotPasswordClient() {
  const f = useForgotPassword();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/5" />

      <div className="relative w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" className="group mb-8 transition-transform hover:scale-110">
            <Image src={siteInfo.logoSrc} alt={siteInfo.shortName} width={72} height={72} priority className="drop-shadow-2xl" />
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400">
              Security Recovery
            </p>
          </div>

          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            Reset Akses
          </h1>
        </div>

        <div className="rounded-[2.5rem] border-2 border-white bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/90 sm:p-10">
          {f.step === 1 && (
            <form onSubmit={f.handleVerifyEmail} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Tahap 1: Verifikasi Identitas</p>
                <div className="group">
                  <label htmlFor="email" className="mb-2 block text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Email Terdaftar</label>
                  <input
                    id="email" type="email" value={f.email} onChange={(e) => f.setEmail(e.target.value)}
                    placeholder="nama@gmail.com" required
                    className={inputClassName()}
                  />
                </div>
              </div>

              {f.error && <StatusAlert type="error" message={f.error} />}

              <button
                type="submit" disabled={f.submitting || !f.email.trim()}
                className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-xs font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-white dark:text-black dark:hover:bg-slate-200"
              >
                <span className="relative z-10">{f.submitting ? "Memverifikasi..." : "Lanjutkan Verifikasi"}</span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </form>
          )}

          {f.step === 2 && (
            <form onSubmit={f.handleResetPassword} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 text-center">Tahap 2: Perbaharui Password</p>

                <div className="group">
                  <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Password Baru</label>
                  <div className="relative">
                    <input
                      type={f.showPassword ? "text" : "password"} value={f.password} onChange={(e) => f.setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter" required
                      className={inputClassName(true)}
                    />
                    <button type="button" onClick={() => f.setShowPassword(!f.showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white transition-all">
                      <EyeIcon isOpen={f.showPassword} />
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {f.password && (
                    <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Security Level</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${f.strength.score === 1 ? "text-rose-500" : f.strength.score === 2 ? "text-amber-500" : "text-emerald-500"}`}>
                          {f.strength.label}
                        </span>
                      </div>
                      <div className="flex gap-1.5 h-1">
                        {[1, 2, 3].map((s) => (
                          <div 
                            key={s} 
                            className={`flex-1 rounded-full transition-all duration-500 ${s <= f.strength.score ? f.strength.color : "bg-slate-100 dark:bg-white/5"}`} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Konfirmasi Password Baru</label>
                  <input
                    type={f.showPassword ? "text" : "password"} value={f.confirmPassword} onChange={(e) => f.setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password" required
                    className={inputClassName()}
                  />
                </div>
              </div>

              {f.error && <StatusAlert type="error" message={f.error} />}

              <button
                type="submit" disabled={f.submitting || !f.password || !f.confirmPassword}
                className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-emerald-600 text-xs font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <span className="relative z-10">{f.submitting ? "Memperbarui..." : "Simpan Password Baru"}</span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>

              <button type="button" onClick={() => f.setStep(1)} className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400">Ganti Email</button>
            </form>
          )}

          {f.step === 3 && (
            <div className="text-center space-y-6 animate-in zoom-in duration-300">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-white">Berhasil!</h2>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">Password Anda telah diperbarui. Silakan gunakan password baru untuk masuk ke Panel Kendali.</p>
              </div>
              <Link href="/admin/login" className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-slate-900 text-xs font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-slate-200">
                Kembali ke Login
              </Link>
            </div>
          )}
          
          {f.step === 4 && (
            <div className="text-center space-y-6 animate-in zoom-in duration-300">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-blue-500 text-white shadow-2xl shadow-blue-500/20">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-white">Cek Email!</h2>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">
                  Kami telah mengirimkan instruksi pemulihan ke <strong>{f.email}</strong>. 
                  Silakan cek kotak masuk atau folder spam Anda.
                </p>
              </div>
              <button 
                onClick={() => f.setStep(1)}
                className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-slate-100 text-xs font-black uppercase tracking-[0.25em] text-slate-600 transition-all hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
              >
                Gunakan Email Lain
              </button>
            </div>
          )}

          {(f.step !== 3 && f.step !== 4) && (
            <div className="mt-8 flex flex-col items-center gap-4 text-center">
              <div className="h-px w-10 bg-slate-100 dark:bg-white/5" />
              <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                Batal & Kembali
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
            © {new Date().getFullYear()} {siteInfo.shortName} · Security Recovery
          </p>
        </div>
      </div>
    </section>
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