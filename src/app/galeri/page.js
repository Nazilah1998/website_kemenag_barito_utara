import PageBanner from "../../components/PageBanner";
import { galleryList } from "../../data/gallery";

export const metadata = {
  title: "Galeri Kegiatan | Kemenag Barito Utara",
  description: "Dokumentasi kegiatan dan aktivitas resmi instansi",
};

export default function GaleriPage() {
  return (
    <>
      <PageBanner
        title="Galeri Kegiatan"
        description="Dokumentasi kegiatan pelayanan, pembinaan, koordinasi, dan aktivitas resmi Kemenag Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Galeri Kegiatan" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {galleryList.map((item) => (
            <article
              key={item.slug}
              className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-white px-6 text-center">
                <div>
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    {item.category}
                  </span>
                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Dokumentasi Kegiatan
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.subtitle}
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}