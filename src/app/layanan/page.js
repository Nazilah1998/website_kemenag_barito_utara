import Link from "next/link";
import PageBanner from "../../components/PageBanner";
import SectionHeading from "../../components/SectionHeading";
import {
  serviceCategories,
  serviceFaqs,
  serviceFlow,
  serviceHighlights,
  serviceOverview,
  serviceRequirements,
} from "../../data/services";
import { siteInfo, siteLinks } from "../../data/site";

export const metadata = {
  title: "Layanan Publik | Kemenag Barito Utara",
  description: "Informasi layanan publik Kemenag Barito Utara",
};

const sectionLinks = [
  { label: "Layanan Utama", href: "#layanan-utama" },
  { label: "Alur", href: "#alur-layanan" },
  { label: "Persyaratan", href: "#persyaratan-layanan" },
  { label: "FAQ", href: "#faq-layanan" },
];

export default function LayananPage() {
  return (
    <>
      <PageBanner
        title="Layanan"
        description="Informasi layanan publik disusun agar lebih jelas, tertata, dan mudah dipahami masyarakat."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Layanan" }]}
      />

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Tentang Layanan
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {serviceOverview.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {serviceOverview.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={siteLinks.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Konsultasi via WhatsApp
              </a>
              <Link
                href="/kontak"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Halaman Kontak
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Jam Pelayanan</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{siteInfo.officeHours}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Arah Layanan</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Informasi layanan dibuat lebih ringkas, sementara alur dan persyaratan
                disusun agar masyarakat lebih mudah mengikuti proses yang benar.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <nav className="flex flex-wrap gap-3" aria-label="Navigasi layanan">
            {sectionLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </section>

        <section id="layanan-utama" className="mt-12">
          <SectionHeading
            eyebrow="Jenis Layanan"
            title="Kategori layanan utama"
            description="Setiap layanan ditampilkan dengan uraian singkat agar pengunjung lebih cepat mengenali kebutuhan yang sesuai."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {serviceHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {item.category}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {serviceCategories.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>

                <ul className="mt-5 space-y-3">
                  {item.items.map((point) => (
                    <li
                      key={point}
                      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="alur-layanan" className="mt-12">
          <SectionHeading
            eyebrow="Alur Layanan"
            title="Tahapan pelayanan yang lebih mudah dipahami"
            description="Urutan berikut membantu pengunjung memahami proses secara ringkas sebelum datang atau menghubungi kantor."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {serviceFlow.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="persyaratan-layanan" className="mt-12">
          <SectionHeading
            eyebrow="Persyaratan"
            title="Dokumen dan catatan dasar yang perlu diperhatikan"
            description="Informasi ini membantu masyarakat menyiapkan kebutuhan awal sebelum memulai proses layanan."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {serviceRequirements.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <ul className="mt-5 space-y-3">
                  {item.items.map((point) => (
                    <li
                      key={point}
                      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="faq-layanan" className="mt-12">
          <SectionHeading
            eyebrow="FAQ"
            title="Pertanyaan yang sering diajukan"
            description="Disusun singkat agar pengunjung cepat menemukan jawaban dasar sebelum menghubungi kantor."
          />

          <div className="mt-8 space-y-3">
            {serviceFaqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                  <span className="text-base font-bold text-slate-900">{item.question}</span>
                  <span className="text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}