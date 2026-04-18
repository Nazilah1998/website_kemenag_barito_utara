"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { siteInfo } from "@/data/site";

function mapMfaError(error) {
    const code = error?.code;
    const message = error?.message || "Terjadi kesalahan pada verifikasi MFA.";

    if (code === "mfa_totp_enroll_not_enabled") {
        return "TOTP MFA belum diaktifkan di Supabase Dashboard.";
    }

    if (code === "mfa_totp_verify_not_enabled") {
        return "Verifikasi TOTP MFA belum diaktifkan di Supabase Dashboard.";
    }

    if (code === "mfa_verification_failed") {
        return "Kode authenticator salah atau sudah kedaluwarsa.";
    }

    if (code === "mfa_challenge_expired") {
        return "Sesi verifikasi MFA sudah kedaluwarsa. Silakan coba lagi.";
    }

    if (code === "mfa_ip_address_mismatch") {
        return "Setup MFA harus diselesaikan dari jaringan/IP yang sama.";
    }

    return message;
}

function ShieldIcon() {
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}

export default function AdminMfaClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = useMemo(() => createClient(), []);

    const requestedMode = searchParams.get("mode");
    const nextParam = searchParams.get("next");

    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("detect");

    const [adminEmail, setAdminEmail] = useState("");
    const [aal, setAal] = useState({
        currentLevel: null,
        nextLevel: null,
    });

    const [factorId, setFactorId] = useState("");
    const [friendlyName, setFriendlyName] = useState("Authenticator Admin");
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [uri, setUri] = useState("");

    const [verifyCode, setVerifyCode] = useState("");
    const [error, setError] = useState("");
    const [initializing, setInitializing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const resolvedNext = useMemo(() => {
        const raw = nextParam ? String(nextParam) : "";
        if (raw.startsWith("/")) return raw;
        return "/admin";
    }, [nextParam]);

    useEffect(() => {
        let active = true;

        async function boot() {
            setLoading(true);
            setError("");

            try {
                const sessionRes = await fetch("/api/admin/session", {
                    method: "GET",
                    cache: "no-store",
                });

                const sessionData = await sessionRes.json().catch(() => null);

                if (!active) return;

                if (!sessionRes.ok || !sessionData?.permissions?.isAdmin) {
                    router.replace("/admin/login?error=unauthorized");
                    router.refresh();
                    return;
                }

                setAdminEmail(sessionData?.user?.email ?? "");

                const { data: aalData, error: aalError } =
                    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

                if (aalError) {
                    throw aalError;
                }

                if (!active) return;

                const currentLevel = aalData?.currentLevel ?? null;
                const nextLevel = aalData?.nextLevel ?? null;

                setAal({ currentLevel, nextLevel });

                if (currentLevel === "aal2") {
                    router.replace(resolvedNext);
                    router.refresh();
                    return;
                }

                let resolvedMode = "enroll";

                if (requestedMode === "verify" || requestedMode === "enroll") {
                    resolvedMode = requestedMode;
                } else if (nextLevel === "aal2") {
                    resolvedMode = "verify";
                }

                setMode(resolvedMode);

                if (resolvedMode === "verify") {
                    const factors = await supabase.auth.mfa.listFactors();

                    if (factors.error) {
                        throw factors.error;
                    }

                    const totpFactor = factors.data?.totp?.[0];

                    if (!totpFactor) {
                        setMode("enroll");
                        return;
                    }

                    setFactorId(totpFactor.id);
                    setFriendlyName(
                        totpFactor.friendly_name || "Authenticator Admin"
                    );
                }
            } catch (err) {
                console.error("boot MFA error:", err);
                if (active) {
                    setError(mapMfaError(err));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        boot();

        return () => {
            active = false;
        };
    }, [requestedMode, resolvedNext, router, supabase]);

    async function handleStartEnrollment() {
        setInitializing(true);
        setError("");
        setQrCode("");
        setSecret("");
        setUri("");
        setFactorId("");

        try {
            const labelBase = adminEmail ? `Admin ${adminEmail}` : "Admin Kemenag";
            const generatedFriendlyName = `${labelBase} ${new Date()
                .toISOString()
                .replace(/[:.]/g, "-")}`;

            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: "totp",
                friendlyName: generatedFriendlyName,
            });

            if (error) {
                throw error;
            }

            setFactorId(data.id);
            setFriendlyName(data.friendly_name || generatedFriendlyName);
            setQrCode(data?.totp?.qr_code || "");
            setSecret(data?.totp?.secret || "");
            setUri(data?.totp?.uri || "");
        } catch (err) {
            console.error("start enrollment error:", err);
            setError(mapMfaError(err));
        } finally {
            setInitializing(false);
        }
    }

    async function handleVerify(event) {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            let activeFactorId = factorId;

            if (!activeFactorId) {
                const factors = await supabase.auth.mfa.listFactors();

                if (factors.error) {
                    throw factors.error;
                }

                const totpFactor = factors.data?.totp?.[0];

                if (!totpFactor) {
                    throw new Error("Faktor TOTP belum tersedia.");
                }

                activeFactorId = totpFactor.id;
                setFactorId(activeFactorId);
            }

            const challenge = await supabase.auth.mfa.challenge({
                factorId: activeFactorId,
            });

            if (challenge.error) {
                throw challenge.error;
            }

            const verify = await supabase.auth.mfa.verify({
                factorId: activeFactorId,
                challengeId: challenge.data.id,
                code: verifyCode.trim(),
            });

            if (verify.error) {
                throw verify.error;
            }

            router.replace(resolvedNext);
            router.refresh();
        } catch (err) {
            console.error("verify MFA error:", err);
            setError(mapMfaError(err));
        } finally {
            setSubmitting(false);
        }
    }

    async function handleLogout() {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error("logout error:", err);
        } finally {
            router.replace("/admin/login");
            router.refresh();
        }
    }

    if (loading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
                    <p className="text-sm font-medium text-slate-700">
                        Mengecek status MFA admin...
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
                            ← Login
                        </Link>
                    </div>

                    <div className="mt-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                            <ShieldIcon />
                            <span>{mode === "verify" ? "Verifikasi MFA" : "Aktifkan MFA"}</span>
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                            {mode === "verify"
                                ? "Masukkan kode authenticator"
                                : "Aktifkan authenticator admin"}
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            {mode === "verify"
                                ? "Masukkan 6 digit kode dari aplikasi authenticator Anda untuk menyelesaikan login atau melanjutkan aksi sensitif."
                                : "Scan QR code dengan Google Authenticator, Authy, atau aplikasi TOTP lain untuk mengaktifkan MFA."}
                        </p>
                    </div>

                    {error ? (
                        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : null}

                    {mode === "enroll" ? (
                        <div className="mt-6 space-y-5">
                            {!qrCode ? (
                                <button
                                    type="button"
                                    onClick={handleStartEnrollment}
                                    disabled={initializing}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                    {initializing ? "Membuat QR..." : "Buat QR Code MFA"}
                                </button>
                            ) : (
                                <>
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-sm font-semibold text-slate-800">
                                            1. Scan QR code ini
                                        </p>

                                        <div className="mt-4 flex justify-center">
                                            <div className="rounded-2xl bg-white p-4 shadow-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={qrCode}
                                                    alt={uri || "QR Code MFA Admin"}
                                                    className="h-52 w-52"
                                                />
                                            </div>
                                        </div>

                                        {secret ? (
                                            <div className="mt-4">
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                    Atau masukkan secret manual
                                                </p>
                                                <div className="mt-2 break-all rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-slate-700">
                                                    {secret}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>

                                    <form onSubmit={handleVerify} className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="mfa-code-enroll"
                                                className="mb-2 block text-sm font-semibold text-slate-800"
                                            >
                                                2. Masukkan 6 digit kode
                                            </label>
                                            <input
                                                id="mfa-code-enroll"
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]{6}"
                                                maxLength={6}
                                                value={verifyCode}
                                                onChange={(event) =>
                                                    setVerifyCode(
                                                        event.target.value.replace(/\D/g, "").slice(0, 6)
                                                    )
                                                }
                                                placeholder="123 456"
                                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-center text-2xl font-bold tracking-[0.4em] text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                                required
                                                autoComplete="one-time-code"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting || verifyCode.length !== 6}
                                            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                            {submitting ? "Mengaktifkan..." : "Aktifkan MFA"}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleVerify} className="mt-7 space-y-5">
                            <div>
                                <label
                                    htmlFor="mfa-code-verify"
                                    className="mb-2 block text-sm font-semibold text-slate-800"
                                >
                                    Kode 6 digit
                                </label>
                                <input
                                    id="mfa-code-verify"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    value={verifyCode}
                                    onChange={(event) =>
                                        setVerifyCode(
                                            event.target.value.replace(/\D/g, "").slice(0, 6)
                                        )
                                    }
                                    placeholder="123 456"
                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-center text-2xl font-bold tracking-[0.4em] text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                    required
                                    autoFocus
                                    autoComplete="one-time-code"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Buka aplikasi authenticator Anda dan masukkan kode yang tampil.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || verifyCode.length !== 6}
                                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {submitting ? "Memverifikasi..." : "Lanjutkan"}
                            </button>
                        </form>
                    )}

                    <div className="mt-5 flex gap-3">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Logout
                        </button>

                        <Link
                            href="/"
                            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Website Utama
                        </Link>
                    </div>

                    <p className="mt-6 text-xs leading-6 text-slate-500">
                        Simpan authenticator hanya pada perangkat yang dikuasai admin terkait.
                        Jangan gunakan perangkat bersama.
                    </p>
                </div>
            </div>
        </section>
    );
}