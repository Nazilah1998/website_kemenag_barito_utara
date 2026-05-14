"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { siteInfo } from "@/data/site";
import { useAdminLogin } from "@/hooks/useAdminLogin";
import { EyeIcon, inputClassName, LoginLoading } from "./login/LoginUI";

export default function AdminLoginClient({ initialUnauthorized = false }) {
  const l = useAdminLogin(initialUnauthorized);

  if (l.loadingSession) return <LoginLoading />;

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
              Administrative Portal
            </p>
          </div>

          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            Panel Kendali
          </h1>
          <p className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            Kementerian Agama Kabupaten Barito Utara
          </p>
        </div>

        <div className="rounded-[2.5rem] border-2 border-white bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/90 sm:p-10">
          <form onSubmit={l.handleSubmit} className="space-y-5">
            <EmailField value={l.email} onChange={l.setEmail} />

            <PasswordField
              value={l.password} onChange={l.setPassword}
              show={l.showPassword} onToggleShow={() => l.setShowPassword(!l.showPassword)}
              onKeyState={l.handlePasswordKeyState} capsLock={l.capsLock}
              error={l.error}
            />

            <div className="pt-2 flex justify-center">
                <ReCAPTCHA
                  sitekey="6LfPTeMsAAAAAHr-HVm6YcHa9HqAaIhxQAgCRLeZ"
                  onChange={l.setRecaptchaToken}
                  theme="light"
                />
            </div>

            {l.error && (
              <div id="admin-login-error" className="flex items-start gap-3 rounded-2xl border-2 border-rose-100 bg-rose-50 p-4 animate-in slide-in-from-top-2 dark:border-rose-900/30 dark:bg-rose-950/20">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-xs font-bold leading-relaxed text-rose-700 dark:text-rose-400">{l.error}</p>
              </div>
            )}

            <SubmitButton submitting={l.submitting} disabled={!l.email || !l.password || !l.recaptchaToken} />
          </form>

          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
            © {new Date().getFullYear()} {siteInfo.shortName} · Secure Access Only
          </p>
        </div>
      </div>
    </section>
  );
}

function EmailField({ value, onChange }) {
  return (
    <div className="group">
      <label htmlFor="admin-email" className="mb-2 block text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Email Admin</label>
      <input id="admin-email" type="email" value={value} onChange={(e) => onChange(e.target.value)} className={inputClassName()} placeholder="nama@gmail.com" autoComplete="email" required />
    </div>
  );
}

function PasswordField({ value, onChange, show, onToggleShow, onKeyState, capsLock, error }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="admin-password" className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Security Password</label>
        <Link href="/admin/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Lupa?</Link>
      </div>
      <div className="relative">
        <input id="admin-password" type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} onKeyUp={onKeyState} onKeyDown={onKeyState} className={inputClassName(true)} placeholder="••••••••" autoComplete="current-password" aria-invalid={Boolean(error)} required />
        <button type="button" onClick={onToggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white transition-all">
          <EyeIcon isOpen={show} />
        </button>
      </div>
      {capsLock && <p className="mt-2 text-[9px] font-black text-amber-600 uppercase tracking-widest">CAPS LOCK AKTIF</p>}
    </div>
  );
}

function SubmitButton({ submitting, disabled }) {
  return (
    <button
      type="submit"
      disabled={submitting || disabled}
      className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-xs font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-white dark:text-black dark:hover:bg-slate-200"
    >
      <span className="relative z-10">{submitting ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
    </button>
  );
}

