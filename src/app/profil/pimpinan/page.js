import Image from "next/image";
import PageBanner from "../../../components/PageBanner";
import ProfileSubnav from "../../../components/ProfileSubnav";
import { leadershipProfiles } from "../../../data/profile";

export const metadata = {
  title: "Profil Pimpinan | Kemenag Barito Utara",
  description: "Profil pimpinan Kemenag Barito Utara",
};

export default function ProfilPimpinanPage() {
  return (
    <>
      <PageBanner
        title="Profil Pimpinan"
        description="Informasi singkat mengenai pimpinan dan pejabat utama Kemenag Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Profil Pimpinan" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <ProfileSubnav />

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {leadershipProfiles.map((item) => (
            <article
              key={item.name + item.position}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-50 bg-emerald-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={88}
                    height={88}
                    className="h-20 w-20 object-contain"
                  />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {item.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-emerald-700">
                  {item.position}
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}