import Image from "next/image";
import Link from "next/link";

function StatusPill({ children, tone = "emerald" }) {
    const styles = {
        emerald:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        amber:
            "border-amber-200 bg-amber-50 text-amber-700",
        slate:
            "border-slate-200 bg-slate-50 text-slate-700",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${styles[tone] || styles.emerald}`}
        >
            {children}
        </span>
    );
}

function SmallInfoCard({ title, children, tone = "slate" }) {
    const tones = {
        slate: "border-slate-200 bg-white",
        emerald: "border-emerald-200 bg-emerald-50/70",
        amber: "border-amber-200 bg-amber-50/80",
    };

    return (
        <div className={`rounded-2xl border p-4 ${tones[tone] || tones.slate}`}>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{children}</p>
        </div>
    );
}

function CheckItem({ children }) {
    return (
        <li className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </span>
            <span className="text-sm leading-6 text-slate-700">{children}</span>
        </li>
    );
}

export default function PremiumMaintenancePage({
    title = "Halaman Dalam Maintenance",
    featureName = "Fitur",
    description = "Halaman ini sedang dalam proses pengembangan dan penyesuaian.",
}) {
    return (
        <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_28%),linear-gradient(to_bottom,#f8fafc,#f1f5f9)]">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[24px_24px]" />
            <section className="mx-auto flex min-h-[calc(100svh-170px)] max-w-7xl items-center px-4 py-4 sm:px-6 md:py-6 lg:px-8">
                <div className="grid w-full gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur">
                        <div className="absolute right-0 top-0 h-36 w-36 translate-x-10 -translate-y-10 rounded-full bg-emerald-100/80 blur-2xl" />
                        <div className="absolute bottom-0 left-0 h-28 w-28 -translate-x-8 translate-y-8 rounded-full bg-amber-100/80 blur-2xl" />

                        <div className="relative flex h-full flex-col justify-between p-6 sm:p-7 lg:p-8">
                            <div>
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                    <StatusPill tone="emerald">Maintenance</StatusPill>
                                    <StatusPill tone="amber">Coming Soon</StatusPill>
                                </div>

                                <div className="mb-5 flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 shadow-sm">
                                        <Image
                                            src="/kemenag.svg"
                                            alt="Logo Kementerian Agama"
                                            width={40}
                                            height={40}
                                            priority
                                            className="h-10 w-10 object-contain"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                                            Kemenag Barito Utara
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Informasi publik sedang diperbarui
                                        </p>
                                    </div>
                                </div>

                                <h1 className="max-w-2xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                                    {title}
                                </h1>

                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                                    {description}
                                </p>
                            </div>

                            <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.95fr]">
                                <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-600 via-emerald-600 to-teal-600 p-5 text-white shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                                                Status Layanan
                                            </p>
                                            <h2 className="mt-2 text-xl font-bold">
                                                {featureName} sementara belum tersedia
                                            </h2>
                                        </div>

                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 9v4" />
                                                <path d="M12 17h.01" />
                                                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm leading-6 text-white/90">
                                        Halaman ini sengaja ditampilkan dalam mode maintenance agar
                                        proses pembaruan dapat dilakukan dengan lebih rapi, aman,
                                        dan terstruktur.
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <Link
                                            href="/"
                                            className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                        >
                                            Kembali ke Beranda
                                        </Link>

                                        <Link
                                            href="/kontak"
                                            className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                                        >
                                            Hubungi Kami
                                        </Link>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                        Dalam Proses
                                    </p>
                                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                                        Yang sedang kami siapkan
                                    </h3>

                                    <ul className="mt-4 space-y-3">
                                        <CheckItem>Tampilan lebih ringkas, jelas, dan modern</CheckItem>
                                        <CheckItem>Struktur data dan konten yang lebih rapi</CheckItem>
                                        <CheckItem>Navigasi yang lebih nyaman digunakan</CheckItem>
                                        <CheckItem>Penyesuaian kualitas layanan informasi publik</CheckItem>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="grid gap-4">
                        <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                                    <Image
                                        src="/kemenag.svg"
                                        alt="Logo Kementerian Agama"
                                        width={26}
                                        height={26}
                                        className="h-6 w-6 object-contain"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                                        Kemenag
                                    </p>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Informasi Pembaruan
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3">
                                <SmallInfoCard title="Mode Maintenance" tone="slate">
                                    Fitur ini sedang ditutup sementara agar proses pembaruan dapat
                                    dilakukan tanpa mengganggu tampilan publik.
                                </SmallInfoCard>

                                <SmallInfoCard title="Fokus Perbaikan" tone="emerald">
                                    Kami sedang merapikan isi halaman, struktur penyajian, serta
                                    kualitas pengalaman pengguna.
                                </SmallInfoCard>

                                <SmallInfoCard title="Catatan" tone="amber">
                                    Silakan gunakan halaman lain yang sudah tersedia. Fitur ini
                                    akan dibuka kembali setelah proses pembaruan selesai.
                                </SmallInfoCard>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-5 shadow-[0_20px_60px_rgba(16,185,129,0.08)] sm:p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                                Akses Cepat
                            </p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                <Link
                                    href="/"
                                    className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"
                                >
                                    <span>Beranda</span>
                                    <span aria-hidden="true">↗</span>
                                </Link>

                                <Link
                                    href="/berita"
                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"
                                >
                                    <span>Berita</span>
                                    <span aria-hidden="true">↗</span>
                                </Link>

                                <Link
                                    href="/kontak"
                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"
                                >
                                    <span>Kontak</span>
                                    <span aria-hidden="true">↗</span>
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}