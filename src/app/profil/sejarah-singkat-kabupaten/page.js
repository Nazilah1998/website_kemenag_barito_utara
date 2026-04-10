import PageBanner from "../../../components/PageBanner";
import ProfileSubnav from "../../../components/ProfileSubnav";
import { regencyHistory } from "../../../data/profile";

export const metadata = {
  title: "Sejarah Singkat Kabupaten | Kemenag Barito Utara",
  description: "Sejarah singkat Kabupaten Barito Utara",
};

export default function SejarahSingkatKabupatenPage() {
  return (
    <>
      <PageBanner
        title="Sejarah Singkat Kabupaten"
        description="Gambaran ringkas perkembangan Kabupaten Barito Utara sebagai wilayah pelayanan Kemenag Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Sejarah Singkat Kabupaten" },
        ]}
      />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ProfileSubnav />

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Sejarah Daerah
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            {regencyHistory.title}
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-700">
            {regencyHistory.intro}
          </p>

          <div className="mt-6 space-y-5">
            {regencyHistory.paragraphs.map((item, index) => (
              <p key={index} className="text-base leading-8 text-slate-600">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
