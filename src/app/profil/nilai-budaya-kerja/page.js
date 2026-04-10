import PageBanner from "../../../components/PageBanner";
import ProfileSubnav from "../../../components/ProfileSubnav";
import { workCultureValues } from "../../../data/profile";

export const metadata = {
  title: "5 Nilai Budaya Kerja | Kemenag Barito Utara",
  description: "Nilai budaya kerja Kemenag Barito Utara",
};

export default function NilaiBudayaKerjaPage() {
  return (
    <>
      <PageBanner
        title="5 Nilai Budaya Kerja"
        description="Nilai-nilai dasar yang menjadi landasan sikap kerja dan pelayanan di lingkungan Kemenag Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "5 Nilai Budaya Kerja" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProfileSubnav />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workCultureValues.map((item, index) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-700">
                {index + 1}
              </span>
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
