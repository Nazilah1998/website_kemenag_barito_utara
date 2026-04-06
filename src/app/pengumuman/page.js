import PageBanner from "../../components/PageBanner";
import { pengumumanList } from "../../data/pengumuman";

export const metadata = {
  title: "Pengumuman | Kemenag Barito Utara",
  description: "Informasi resmi dan pengumuman penting instansi",
};

export default function PengumumanPage() {
  return (
    <>
      <PageBanner
        title="Pengumuman"
        description="Informasi resmi, agenda, dan pemberitahuan penting dari Kemenag Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Pengumuman" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pengumumanList.map((item) => (
            <article
              key={item.slug}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={
                    item.isImportant
                      ? "inline-flex rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white"
                      : "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  }
                >
                  {item.isImportant ? "Penting" : item.category}
                </span>

                <span className="text-sm text-slate-500">{item.date}</span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {item.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-600">{item.excerpt}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}