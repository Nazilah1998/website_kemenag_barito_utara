import PageBanner from "../../../components/PageBanner";
import ServicesSubnav from "../../../components/ServicesSubnav";
import { serviceFaqs } from "../../../data/services";

export const metadata = {
  title: "FAQ Layanan | Kemenag Barito Utara",
  description: "Pertanyaan yang sering diajukan terkait layanan",
};

export default function FaqLayananPage() {
  return (
    <>
      <PageBanner
        title="FAQ Layanan"
        description="Pertanyaan umum terkait layanan, persyaratan, dan proses pelayanan."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Layanan", href: "/layanan" },
          { label: "FAQ" },
        ]}
      />

      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <ServicesSubnav />

        <section className="space-y-5">
          {serviceFaqs.map((item, index) => (
            <article
              key={item.question}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                    {item.question}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                    {item.answer}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}