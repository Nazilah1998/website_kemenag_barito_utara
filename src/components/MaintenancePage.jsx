import Link from "next/link";
import Image from "next/image";
import { siteInfo } from "../data/site";

const quickLinks = [
    { label: "Beranda", href: "/" },
    { label: "Berita", href: "/berita" },
    { label: "Kontak", href: "/kontak" },
];

export default function MaintenancePage({
    title = "Informasi Sedang Diperbarui",
    menuName = "Informasi Publik",
    description = "Halaman ini sedang dalam proses penataan ulang agar informasi dapat ditampilkan dengan lebih rapi, ringan, modern, dan nyaman diakses.",
}) {
    return (
        <main className="min-h-screen bg-linear-to-br from-emerald-50 via-slate-50 to-amber-50">
            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
                <div className="rounded-4xl border border-white/80 bg-white/90 p-8 shadow-xl backdrop-blur">
                    <div className="flex flex-wrap gap-3">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
                            Maintenance
                        </span>
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-amber-700">
                            Coming Soon
                        </span>
                    </div>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 p-2 ring-1 ring-emerald-100">
                            <Image
                                src={siteInfo.logoSrc}
                                alt={siteInfo.shortName}
                                width={48}
                                height={48}
                                className="h-12 w-12 object-contain"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-700">
                                {siteInfo.shortName}
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {menuName}
                            </p>
                        </div>
                    </div>

                    <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                        {title}
                    </h1>

                    <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
                        {description}
                    </p>

                    <div className="mt-10 grid gap-5 md:grid-cols-2">
                        <div className="rounded-3xl bg-emerald-700 p-6 text-white shadow-lg">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-100">
                                Status Layanan
                            </p>
                            <h2 className="mt-3 text-2xl font-black">
                                Fitur sementara belum tersedia
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-emerald-50">
                                Halaman ini sengaja dikosongkan sementara sampai data dan
                                dokumen resmi siap dipublikasikan.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/"
                                    className="rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-800"
                                >
                                    Kembali ke Beranda
                                </Link>

                                <Link
                                    href="/kontak"
                                    className="rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white"
                                >
                                    Hubungi Kami
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                                Dalam Proses
                            </p>

                            <div className="mt-5 space-y-4 text-sm font-medium text-slate-600">
                                {[
                                    "Penataan struktur informasi halaman",
                                    "Penyusunan data dan dokumen resmi",
                                    "Peningkatan kualitas tampilan publik",
                                    "Validasi konten sebelum ditampilkan",
                                ].map((item) => (
                                    <div key={item} className="flex gap-3">
                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                                            ✓
                                        </span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-4xl border border-white/80 bg-white/90 p-8 shadow-xl backdrop-blur">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 p-2 ring-1 ring-emerald-100">
                                <Image
                                    src={siteInfo.logoSrc}
                                    alt={siteInfo.shortName}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 object-contain"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700">
                                    Kemenag
                                </p>
                                <h2 className="text-xl font-black text-slate-950">
                                    Informasi Pembaruan
                                </h2>
                            </div>
                        </div>

                        <div className="mt-7 space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                <h3 className="font-black text-slate-900">Mode Maintenance</h3>
                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                    Fitur sedang ditutup sementara agar proses pembaruan dapat
                                    dilakukan tanpa mengganggu tampilan publik.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                <h3 className="font-black text-slate-900">Fokus Perbaikan</h3>
                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                    Kami sedang merapikan isi halaman, struktur penyajian, serta
                                    kualitas pengalaman pengguna.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                <h3 className="font-black text-slate-900">Catatan</h3>
                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                    Silakan gunakan halaman lain yang sudah tersedia. Fitur ini
                                    akan dibuka kembali setelah pembaruan selesai.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-4xl border border-emerald-100 bg-emerald-50 p-8 shadow-sm">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700">
                            Akses Cepat
                        </p>

                        <div className="mt-5 space-y-3">
                            {quickLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-sm font-bold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
                                >
                                    {item.label}
                                    <span>↗</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
}