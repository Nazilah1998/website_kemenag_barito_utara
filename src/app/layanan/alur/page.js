import PageBanner from "../../../components/PageBanner";
import ServicesSubnav from "../../../components/ServicesSubnav";
import { serviceFlow } from "../../../data/services";

export const metadata = {
  title: "Alur Layanan | Kemenag Barito Utara",
  description: "Alur umum layanan Kemenag Barito Utara",
};

export default function AlurLayananPage() {
  return (
    <>
      <PageBanner
        title="Alur Layanan"
        description="Tahapan umum pelayanan untuk membantu masyarakat memahami proses layanan."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Layanan", href: "/layanan" },
          { label: "Alur Layanan" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <ServicesSubnav />

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Tahapan Pelayanan
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Alur Umum Pelayanan Masyarakat
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {serviceFlow.map((item) => (
              <article
                key={item.step}
                className="rounded-[2rem] bg-slate-50 p-5 ring-1 ring-slate-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  {item.step}
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}