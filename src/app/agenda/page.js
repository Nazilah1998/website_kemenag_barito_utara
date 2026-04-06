import PageBanner from "../../components/PageBanner";
import { agendaList } from "../../data/agenda";

export const metadata = {
  title: "Agenda Kegiatan | Kemenag Barito Utara",
  description: "Jadwal agenda dan kegiatan resmi instansi",
};

export default function AgendaPage() {
  return (
    <>
      <PageBanner
        title="Agenda Kegiatan"
        description="Jadwal kegiatan, pembinaan, koordinasi, dan agenda resmi Kemenag Barito Utara."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Agenda Kegiatan" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {agendaList.map((item) => (
            <article
              key={item.slug}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={
                    item.status === "Terdekat"
                      ? "inline-flex rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white"
                      : "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                  }
                >
                  {item.status}
                </span>

                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {item.category}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {item.title}
              </h2>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Tanggal:</span>{" "}
                  {item.date}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Waktu:</span>{" "}
                  {item.time}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Lokasi:</span>{" "}
                  {item.location}
                </p>
              </div>

              <p className="mt-4 leading-7 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}