"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { siteInfo } from "@/data/site";

function mapLoginError(error) {
  return error?.message || "Terjadi kesalahan saat login admin.";
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

function createSimpleCaptcha(length = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let i = 0; i < length; i += 1) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
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
  const [error, setError] = useState(
    initialUnauthorized
      ? "Sesi Anda tidak valid atau tidak memiliki akses admin."
      : "",
  );

  const [captchaChallenge, setCaptchaChallenge] = useState(() =>
    createSimpleCaptcha(),
  );
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (!active) return;

        if (!sessionError && data?.session) {
          const res = await fetch("/api/admin/session", {
            method: "GET",
            cache: "no-store",
          });

          if (!active) return;

          if (res.ok) {
            const payload = await res.json();
            if (
              payload?.ok &&
              (payload?.permissions?.isAdmin || payload?.permissions?.isEditor)
            ) {
              router.replace("/admin");
              return;
            }
          }
        }
      } catch {
        // ignore
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
  }, [router, supabase]);

  function handlePasswordKeyState(event) {
    setCapsLock(Boolean(event.getModifierState?.("CapsLock")));
  }

  function refreshCaptcha() {
    setCaptchaChallenge(createSimpleCaptcha());
    setCaptchaInput("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    setError("");

    const normalizedCaptchaInput = captchaInput.trim().toUpperCase();
    if (!normalizedCaptchaInput || normalizedCaptchaInput !== captchaChallenge) {
      setError("Captcha tidak sesuai. Silakan coba lagi.");
      refreshCaptcha();
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const payload = await res.json();

      if (!res.ok || !payload?.ok) {
        setError(mapLoginError(payload));
        refreshCaptcha();
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan jaringan saat login.");
      refreshCaptcha();
    } finally {
      setSubmitting(false);
    }
  }

  const submitDisabled =
    loadingSession ||
    submitting ||
    !email.trim() ||
    !password ||
    !captchaInput.trim();

  if (loadingSession) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          <p className="text-sm font-medium text-slate-700">
            Memeriksa sesi admin...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.08),transparent_35%)]" />

      <div className="relative w-full max-w-lg rounded-4xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src={siteInfo.logoSrc}
              alt={siteInfo.shortName}
              width={44}
              height={44}
              priority
            />
            <div>
              <p className="text-sm font-bold text-slate-900">{siteInfo.shortName}</p>
              <p className="text-xs text-slate-500">Panel Admin</p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
            Gunakan akun admin terdaftar dan selesaikan verifikasi captcha sederhana sebelum login.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Email admin
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName()}
              placeholder="nama@domain.go.id"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-slate-800"
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
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyUp={handlePasswordKeyState}
                onKeyDown={handlePasswordKeyState}
                className={inputClassName(true)}
                autoComplete="current-password"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "admin-login-error" : undefined}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
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

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Verifikasi Captcha
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg font-bold tracking-[0.22em] text-slate-900">
                {captchaChallenge}
              </div>

              <button
                type="button"
                onClick={refreshCaptcha}
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Refresh
              </button>
            </div>

            <div className="mt-3">
              <label
                htmlFor="admin-captcha"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Ketik captcha di atas
              </label>
              <input
                id="admin-captcha"
                type="text"
                value={captchaInput}
                onChange={(event) => setCaptchaInput(event.target.value.toUpperCase())}
                className={inputClassName()}
                placeholder="Masukkan kode captcha"
                autoComplete="off"
                maxLength={8}
                required
              />
            </div>
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
          Akses ini khusus untuk admin internal. Jika Anda bukan admin, kembali ke
          halaman utama website.
        </div>
      </div>
    </section>
  );
}
