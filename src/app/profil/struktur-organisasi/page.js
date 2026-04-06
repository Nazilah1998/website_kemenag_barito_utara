import PageBanner from "../../../components/PageBanner";
import ProfileSubnav from "../../../components/ProfileSubnav";
import { organizationStructure } from "../../../data/profile";

export const metadata = {
  title: "Struktur Organisasi | Kemenag Barito Utara",
  description: "Struktur organisasi Kemenag Barito Utara",
};

export default function StrukturOrganisasiPage() {
  const head = organizationStructure.find((item) => item.level === "primary");
  const members = organizationStructure.filter(
    (item) => item.level === "secondary"
  );

  return (
    <>
      <PageBanner
        title="Struktur Organisasi"
        description="Susunan organisasi dan gambaran jabatan di lingkungan Kemenag Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Struktur Organisasi" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <ProfileSubnav />

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Susunan Organisasi
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Struktur Jabatan Kelembagaan
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Struktur berikut menggambarkan susunan jabatan utama yang
              mendukung penyelenggaraan pelayanan, pembinaan, dan tata kelola
              kelembagaan di Kemenag Barito Utara.
            </p>
          </div>

          {head && (
            <div className="mt-10">
              <div className="mx-auto max-w-xl rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-900 p-6 text-center text-white shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Pimpinan Utama
                </p>
                <h3 className="mt-3 text-2xl font-bold">{head.position}</h3>
                <p className="mt-2 text-sm text-emerald-50/90 md:text-base">
                  {head.name}
                </p>
              </div>

              <div className="mx-auto h-10 w-px bg-emerald-200" />

              <div className="mx-auto h-px max-w-5xl bg-emerald-200" />
            </div>
          )}

          <div className="grid gap-5 pt-10 md:grid-cols-2 xl:grid-cols-3">
            {members.map((item) => (
              <div
                key={item.position}
                className="relative rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="absolute left-1/2 top-0 h-6 w-px -translate-y-6 bg-emerald-200" />
                <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Jabatan
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {item.position}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Keterangan
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Fungsi Struktur Organisasi
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                Struktur organisasi membantu memastikan pembagian peran,
                koordinasi antarunit, efektivitas pengambilan keputusan, dan
                kelancaran pelayanan publik di lingkungan kantor.
              </p>
            </div>

            <div className="rounded-[2rem] bg-emerald-50 p-6 ring-1 ring-emerald-100 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Catatan
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Pembaruan Data Jabatan
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                Nama pejabat dan susunan jabatan dapat diperbarui sewaktu-waktu
                sesuai kebutuhan organisasi. Untuk versi final, silakan ganti
                data jabatan pada file <span className="font-semibold">src/data/profile.js</span>.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}