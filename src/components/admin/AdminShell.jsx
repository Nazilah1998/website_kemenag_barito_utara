"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12" /><path d="M18 6L6 18" />
        </svg>
    );
}

export default function AdminShell({ children }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sessionData, setSessionData] = useState(null);
    const [permissionContext, setPermissionContext] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function loadSession() {
            try {
                const [sessionRes, permRes] = await Promise.all([
                    fetch("/api/admin/session", { cache: "no-store" }),
                    fetch("/api/admin/my-permissions", { cache: "no-store" }),
                ]);

                const session = await sessionRes.json().catch(() => null);
                const perm = await permRes.json().catch(() => null);

                if (!active) return;

                if (!sessionRes.ok || !session?.permissions?.isAdmin) {
                    router.replace("/admin/login");
                    return;
                }

                setSessionData(session);
                setPermissionContext(perm?.permissionContext || null);
            } catch {
                if (active) router.replace("/admin/login");
            } finally {
                if (active) setLoading(false);
            }
        }

        loadSession();

        return () => { active = false; };
    }, [router]);

    useEffect(() => {
        if (!sidebarOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [sidebarOpen]);

    const profile = sessionData?.user || null;
    const role = sessionData?.permissions?.role || null;

    const compactName = useMemo(() => {
        const name = String(profile?.full_name || "").trim();
        if (name) return name;
        const email = String(profile?.email || "").trim();
        return email ? email.split("@")[0] : "Admin";
    }, [profile]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
                    <p className="text-sm font-medium text-slate-600">Memuat panel admin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 lg:flex">
            <aside className="hidden lg:block lg:w-72 lg:shrink-0">
                <div className="sticky top-0 h-screen border-r border-slate-200 bg-white">
                    <AdminSidebar
                        profile={profile}
                        role={role}
                        permissionContext={permissionContext}
                    />
                </div>
            </aside>

            {sidebarOpen ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Tutup sidebar"
                        onClick={() => setSidebarOpen(false)}
                        className="absolute inset-0 bg-slate-950/45"
                    />
                    <div className="relative h-full w-[85%] max-w-[320px] border-r border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Panel Admin</p>
                                <p className="mt-1 text-sm font-bold text-slate-900">Kemenag Barito Utara</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <AdminSidebar
                            profile={profile}
                            role={role}
                            permissionContext={permissionContext}
                            onNavigate={() => setSidebarOpen(false)}
                        />
                    </div>
                </div>
            ) : null}

            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
                    <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 lg:hidden"
                                aria-label="Buka sidebar"
                            >
                                <MenuIcon />
                            </button>
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">Panel Admin</p>
                                <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">Kemenag Barito Utara</h1>
                            </div>
                        </div>
                        <div className="hidden min-w-0 max-w-[40%] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 sm:block">
                            <p className="truncate text-sm font-semibold text-slate-900">{compactName}</p>
                            <p className="truncate text-xs text-slate-500">{profile?.email || "-"}</p>
                        </div>
                    </div>
                </header>

                <main className="min-w-0 px-4 py-5 sm:px-6 xl:px-8">{children}</main>
            </div>
        </div>
    );
}