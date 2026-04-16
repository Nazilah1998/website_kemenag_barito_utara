"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { siteInfo } from "@/data/site";

const securityPoints = [
  "Gunakan akun admin yang memang sudah memiliki role admin atau super_admin.",
  "Jangan bagikan email dan password panel kepada pihak lain.",
  "Gunakan password yang kuat dan berbeda dari akun personal.",
];

function mapMfaError(error) {
  const code = error?.code;
  const message = error?.message || "Gagal memeriksa status MFA admin.";

  if (code === "mfa_totp_enroll_not_enabled") {
    return "TOTP MFA belum diaktifkan di Supabase Dashboard.";
  }

  if (code === "mfa_totp_verify_not_enabled") {
    return "Verifikasi TOTP MFA belum diaktifkan di Supabase Dashboard.";
  }

  return message;
}

function inputClassName(hasTrailingButton = false) {
  return `w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${hasTrailingButton ? "pr-28" : ""
    }`;
}

export default function AdminLoginClient({ initialUnauthorized = false }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState("");

  const submitDisabled = useMemo(() => {
    return submitting || !email.trim() || !password;
  }, [email, password, submitting]);

  const resolveDestinationAfterAdminAuth = useCallback(async () => {
    const { data, error } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error) {
      throw error;
    }

    if (data?.currentLevel === "aal2") {
      return "/admin";
    }

    if (data?.nextLevel === "aal2") {
      return "/admin/mfa?mode=verify";
    }

    return "/admin/mfa?mode=enroll";
  }, [supabase]);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json().catch(() => null);

        if (!active) return;

        if (res.ok && data?.permissions?.isAdmin) {
          const destination = await resolveDestinationAfterAdminAuth();

          if (!active) return;

          router.replace(destination);
          router.refresh();
          return;
        }

        if (initialUnauthorized) {
          setError("Akun berhasil login, tetapi role-nya bukan admin.");
        }
      } catch (err) {
        console.error("checkSession error:", err);

        if (active && initialUnauthorized) {
          setError("Akun berhasil login, tetapi role-nya bukan admin.");
        }
      } finally {
        if (active) {
          setLoadingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router, initialUnauthorized, resolveDestinationAfterAdminAuth]);

  function handlePasswordKeyState(event) {
    setCapsLock(event.getModifierState("CapsLock"));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const loginRes = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const loginData = await loginRes.json().catch(() => null);

      if (!loginRes.ok) {
        setError(loginData?.message || loginData?.error || "Login gagal.");
        return;
      }

      const sessionRes = await fetch("/api/admin/session", {
        method: "GET",
        cache: "no-store",
      });

      const sessionData = await sessionRes.json().catch(() => null);

      if (!sessionRes.ok || !sessionData?.permissions?.isAdmin) {
        setError(
          "Login berhasil, tetapi akun ini belum memiliki role admin/super_admin di tabel profiles."
        );
        return;
      }

      const destination = await resolveDestinationAfterAdminAuth();
      router.replace(destination);
      router.refresh();
    } catch (err) {
      console.error("handleSubmit error:", err);
      setError(
        mapMfaError(err) ||
        "Terjadi kesalahan jaringan. Coba lagi beberapa saat."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingSession) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          <p className="text-sm font-medium text-slate-700">
            Mengecek session admin...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-slate-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.10),transparent_30%)]" />

      <div className="relative w-full max-w-6xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden lg:flex flex-col justify-between bg-slate-950 px-10 py-10 text-white">
            <div>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Image
                  src={siteInfo.logoSrc}
                  alt={siteInfo.shortName}
                  width={42}
                  height={42}
                  priority
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                    Panel Internal
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    {siteInfo.shortName}
                  </h2>
                </div>
              </div>

              <div className="mt-10 max-w-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">
                  Area Admin
                </p>
                <h1 className="mt-4 text-4xl font-bold leading-tight">
                  Akses panel admin secara lebih fokus, rapi, dan aman.
                </h1>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  Halaman ini dipisahkan dari tampilan publik agar proses login
                  lebih nyaman, lebih profesional, dan tidak terganggu elemen
                  website umum.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-white">
                Pengingat keamanan
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                {securityPoints.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-md">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src={siteInfo.logoSrc}
                  alt={siteInfo.shortName}
                  width={44}
                  height={44}
                  priority
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {siteInfo.shortName}
                  </p>
                  <p className="text-xs text-slate-500">{siteInfo.tagline}</p>
                </div>
              </Link>

              <div className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">
                    Admin Login
                  </p>

                  <Link
                    href="/"
                    className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    ← Kembali ke Website Utama
                  </Link>
                </div>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  Masuk ke Panel Admin
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Gunakan akun Admin yang sudah terdaftar. Setelah
                  login, akun admin akan dicek status MFA-nya sebelum masuk ke
                  dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nama@gmail.com"
                    autoComplete="username"
                    className={inputClassName(false)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onKeyDown={handlePasswordKeyState}
                      onKeyUp={handlePasswordKeyState}
                      onBlur={() => setCapsLock(false)}
                      placeholder="Masukkan password admin"
                      autoComplete="current-password"
                      className={inputClassName(true)}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
                    >
                      {showPassword ? "Sembunyikan" : "Lihat"}
                    </button>
                  </div>

                  {capsLock ? (
                    <p className="mt-2 text-xs font-medium text-amber-700">
                      Caps Lock sedang aktif.
                    </p>
                  ) : null}
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitDisabled}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Masuk..." : "Login Admin"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Keamanan admin
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Setelah email dan password benar, akun admin akan diarahkan ke
                  verifikasi MFA atau setup authenticator jika belum pernah
                  diaktifkan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}