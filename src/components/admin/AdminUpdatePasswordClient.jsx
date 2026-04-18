"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { siteInfo } from "@/data/site";

function inputClassName(hasTrailingButton = false) {
    return [
        "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5",
        "text-sm font-medium text-black outline-none transition",
        "placeholder:text-slate-400",
        "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
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

export default function AdminUpdatePasswordClient() {
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [checking, setChecking] = useState(true);
    const [ready, setReady] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let active = true;

        async function checkRecoverySession() {
            try {
                const { data, error } =
                    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

                if (!active) return;

                if (error) {
                    setError(error.message || "Gagal memeriksa status sesi reset password.");
                    setChecking(false);
                    return;
                }

                const currentLevel = data?.currentLevel ?? null;
                const nextLevel = data?.nextLevel ?? null;

                if (currentLevel === "aal2") {
                    setReady(true);
                    setChecking(false);
                    return;
                }

                if (nextLevel === "aal2") {
                    router.replace("/admin/mfa?mode=verify&next=/update-password");
                    return;
                }

                if (currentLevel === "aal1" && nextLevel !== "aal2") {
                    setReady(true);
                    setChecking(false);
                    return;
                }

                setError("Sesi reset password tidak valid atau sudah kedaluwarsa.");
            } catch (err) {
                if (!active) return;
                setError(
                    err?.message || "Terjadi kesalahan saat memeriksa sesi reset password."
                );
            } finally {
                if (active) {
                    setChecking(false);
                }
            }
        }

        checkRecoverySession();

        return () => {
            active = false;
        };
    }, [router, supabase]);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (password.length < 8) {
            setError("Password baru minimal 8 karakter.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Konfirmasi password tidak sama.");
            return;
        }

        setSubmitting(true);

        try {
            const { data: aalData, error: aalError } =
                await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

            if (aalError) {
                throw aalError;
            }

            if (aalData?.currentLevel !== "aal2" && aalData?.nextLevel === "aal2") {
                router.replace("/admin/mfa?mode=verify&next=/update-password");
                return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) {
                throw updateError;
            }

            setSuccess("Password berhasil diperbarui. Silakan login kembali.");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                router.replace("/admin/login");
            }, 1500);
        } catch (err) {
            const message =
                err?.message ||
                "Gagal memperbarui password. Silakan ulangi dari email reset.";

            if (
                message.includes("AAL2 session is required") ||
                message.includes("aal2")
            ) {
                router.replace("/admin/mfa?mode=verify&next=/update-password");
                return;
            }

            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    if (checking) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
                    <p className="text-sm font-medium text-slate-700">
                        Memeriksa sesi reset password...
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
                            href="/admin/login"
                            className="inline-flex items-center rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Login
                        </Link>
                    </div>

                    <div className="mt-8">
                        <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                            Update Password
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                            Buat password baru
                        </h1>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            Masukkan password baru untuk akun Anda. Jika MFA aktif, sistem akan
                            meminta verifikasi tambahan terlebih dahulu.
                        </p>
                    </div>

                    {ready ? (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-black">
                                    Password baru
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        className={inputClassName(true)}
                                        placeholder="Minimal 8 karakter"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((value) => !value)}
                                        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-black"
                                        aria-label={
                                            showPassword ? "Sembunyikan password baru" : "Lihat password baru"
                                        }
                                    >
                                        <EyeIcon isOpen={showPassword} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-black">
                                    Konfirmasi password baru
                                </label>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        className={inputClassName(true)}
                                        placeholder="Ulangi password baru"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((value) => !value)}
                                        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-black"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Sembunyikan konfirmasi password"
                                                : "Lihat konfirmasi password"
                                        }
                                    >
                                        <EyeIcon isOpen={showConfirmPassword} />
                                    </button>
                                </div>
                            </div>

                            {error ? (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {error}
                                </div>
                            ) : null}

                            {success ? (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {success}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={submitting || !password || !confirmPassword}
                                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {submitting ? "Menyimpan..." : "Simpan password baru"}
                            </button>
                        </form>
                    ) : (
                        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
                            Sesi reset password belum siap. Jika akun Anda memakai MFA, silakan
                            lanjutkan verifikasi MFA terlebih dahulu.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}