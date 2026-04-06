import PageBanner from "../../../components/PageBanner";
import ProfileSubnav from "../../../components/ProfileSubnav";
import { visionMission } from "../../../data/profile";

export const metadata = {
  title: "Visi & Misi | Kemenag Barito Utara",
  description: "Visi, misi, dan nilai kelembagaan Kemenag Barito Utara",
};

export default function VisiMisiPage() {
  return (
    <>
      <PageBanner
        title="Visi & Misi"
        description="Arah kelembagaan dan komitmen pelayanan Kemenag Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Visi & Misi" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <ProfileSubnav />

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-900 p-6 text-white shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
              Visi
            </p>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Arah Besar Pelayanan Instansi
            </h2>
            <p className="mt-5 text-sm leading-8 text-emerald-50/95 md:text-base">
              {visionMission.vision}
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Nilai Dasar
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Nilai yang Dipegang Instansi
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {visionMission.values.map((value) => (
                <span
                  key={value}
                  className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Misi
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Langkah Strategis Kelembagaan
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {visionMission.missions.map((item, index) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}