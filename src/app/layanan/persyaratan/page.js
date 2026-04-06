import PageBanner from "../../../components/PageBanner";
import ServicesSubnav from "../../../components/ServicesSubnav";
import { serviceRequirements } from "../../../data/services";

export const metadata = {
  title: "Persyaratan Layanan | Kemenag Barito Utara",
  description: "Persyaratan umum layanan Kemenag Barito Utara",
};

export default function PersyaratanLayananPage() {
  return (
    <>
      <PageBanner
        title="Persyaratan Layanan"
        description="Informasi umum mengenai persyaratan dasar dan dokumen pendukung layanan."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Layanan", href: "/layanan" },
          { label: "Persyaratan Layanan" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <ServicesSubnav />

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {serviceRequirements.map((group) => (
            <article
              key={group.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900">
                {group.title}
              </h2>

              <div className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700"
                  >
                    • {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}