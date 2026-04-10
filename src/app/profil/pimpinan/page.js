import Image from "next/image";
import PageBanner from "../../../components/PageBanner";
import ProfileSubnav from "../../../components/ProfileSubnav";
import { leadershipProfiles } from "../../../data/profile";

export const metadata = {
  title: "Profil Kepala Kantor | Kemenag Barito Utara",
  description: "Profil Kepala Kantor Kementerian Agama Kabupaten Barito Utara",
};

export default function ProfilPimpinanPage() {
  const kepalaKantor = leadershipProfiles[0];

  return (
    <>
      <PageBanner
        title="Profil Kepala Kantor"
        description="Informasi singkat mengenai Kepala Kantor Kementerian Agama Kabupaten Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Profil Kepala Kantor" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ProfileSubnav />

        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex aspect-4/5 items-center justify-center rounded-2xl bg-emerald-50">
              <Image
                src={kepalaKantor.image}
                alt={kepalaKantor.name}
                width={180}
                height={180}
                className="h-40 w-40 object-contain"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Kepala Kantor
            </span>

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {kepalaKantor.name}
            </h2>

            <p className="mt-2 text-lg font-medium text-slate-600">
              {kepalaKantor.position}
            </p>

            <p className="mt-6 text-base leading-8 text-slate-700">
              {kepalaKantor.description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
