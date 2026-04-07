"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
          router.replace("/admin");
          router.refresh();
          return;
        }

        if (searchParams.get("error") === "unauthorized") {
          setError("Akun berhasil login, tetapi role-nya bukan admin.");
        }
      } catch (err) {
        console.error("checkSession error:", err);
      } finally {
        if (active) setLoadingSession(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router, searchParams]);

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
        setError(loginData?.message || "Login gagal.");
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

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      console.error("handleSubmit error:", err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingSession) {
    return (
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          Mengecek session admin...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Admin Login
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Masuk ke panel admin
        </h1>

        <p className="mt-2 text-slate-600">
          Gunakan akun admin Supabase yang sudah terdaftar.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@contoh.go.id"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500"
              required
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
          >
            {submitting ? "Masuk..." : "Login Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}