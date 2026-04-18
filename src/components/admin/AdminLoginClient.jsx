"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { siteInfo } from "@/data/site";

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
  return [
    "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5",
    "text-sm font-medium text-slate-900 shadow-sm outline-none transition",
    "placeholder:text-slate-500",
    "focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100",
    hasTrailingButton ? "pr-12" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function EyeIcon({ isOpen = false }) {
  if (isOpen) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 16.11 1 12c.92-2.18 2.36-4.01 4.16-5.36" />
        <path d="M10.58 10.58A2 2 0 1 0 13.41 13.41" />
        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 2.89 11 7a11.05 11.05 0 0 1-1.68 2.75" />
        <path d="M1 1l22 22" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
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
      <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_30%)]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between gap-4">
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
                <p className="text-xs text-slate-500">Panel Admin</p>
              </div>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Kembali
            </Link>
          </div>

          <div className="mt-8">
            <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Login Admin
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              Masuk ke panel admin
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Gunakan akun admin yang sudah terdaftar. Setelah login, sistem
              akan melanjutkan ke verifikasi MFA bila diperlukan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-900"
              >
                Email admin
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="nama@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClassName(false)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "admin-login-error" : undefined}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-900"
                >
                  Password
                </label>

                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  Lupa password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyUp={handlePasswordKeyState}
                  onKeyDown={handlePasswordKeyState}
                  className={inputClassName(true)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "admin-login-error" : undefined}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Lihat password"
                  }
                >
                  <EyeIcon isOpen={showPassword} />
                </button>
              </div>

              {capsLock ? (
                <p className="mt-2 text-xs font-medium text-amber-600">
                  Caps Lock sedang aktif.
                </p>
              ) : null}
            </div>

            {error ? (
              <div
                id="admin-login-error"
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitDisabled}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? "Memproses..." : "Masuk ke Panel Admin"}
            </button>

            <div className="flex items-center justify-center pt-1">
              <Link
                href="/admin/register-editor"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Daftar akun editor
              </Link>
            </div>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
            Akses ini khusus untuk admin internal. Jika Anda bukan admin, kembali
            ke halaman utama website.
          </div>
        </div>
      </div>
    </section>
  );
}