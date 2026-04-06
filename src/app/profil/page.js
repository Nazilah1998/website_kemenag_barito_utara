import Link from "next/link";
import PageBanner from "../../components/PageBanner";
import ProfileSubnav from "../../components/ProfileSubnav";
import { profileOverview } from "../../data/profile";

const profileMenus = [
  {
    title: "Visi & Misi",
    href: "/profil/visi-misi",
    description:
      "Arah, tujuan, dan nilai dasar pelayanan Kemenag Barito Utara.",
  },
  {
    title: "Struktur Organisasi",
    href: "/profil/struktur-organisasi",
    description:
      "Susunan organisasi dan gambaran unit jabatan di lingkungan kantor.",
  },
  {
    title: "Profil Pimpinan",
    href: "/profil/pimpinan",
    description:
      "Informasi singkat mengenai pimpinan dan pejabat utama instansi.",
  },
];

export const metadata = {
  title: "Profil Instansi | Kemenag Barito Utara",
  description: "Profil resmi Kantor Kementerian Agama Kabupaten Barito Utara",
};

export default function ProfilPage() {
  return (
    <>
      <PageBanner
        title="Profil Instansi"
        description="Informasi umum mengenai identitas, peran, dan arah kelembagaan Kemenag Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Profil Instansi" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <ProfileSubnav />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Tentang Instansi
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              {profileOverview.title}
            </h2>

            <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">
              {profileOverview.description}
            </p>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-900 p-6 text-white shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
              Ringkasan Peran
            </p>

            <div className="mt-5 space-y-5">
              {profileOverview.highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Informasi Profil
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Jelajahi Profil Kelembagaan
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {profileMenus.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
                <div className="mt-5 inline-flex text-sm font-semibold text-emerald-700">
                  Buka halaman →
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}