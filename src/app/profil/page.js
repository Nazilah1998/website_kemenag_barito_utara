import PageBanner from "../../components/PageBanner";
import ProfileSubnav from "../../components/ProfileSubnav";
import { profileOverview } from "../../data/profile";

export const metadata = {
  title: "Profil Instansi | Kemenag Barito Utara",
  description: "Profil resmi Kantor Kementerian Agama Kabupaten Barito Utara",
};

export default function ProfilPage() {
  return (
    <>
      <PageBanner
        title="Profil Instansi"
        description="Informasi profil kelembagaan Kementerian Agama Kabupaten Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Profil Instansi" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProfileSubnav />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Tentang Instansi
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {profileOverview.title}
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-600">
              {profileOverview.description}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm">
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
              Ringkasan Peran
            </span>

            <div className="mt-5 space-y-4">
              {profileOverview.highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
