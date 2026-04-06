import Link from "next/link";
import { agendaList } from "../data/agenda";

export default function AgendaSection() {
  const featuredAgenda = agendaList[0];
  const otherAgenda = agendaList.slice(1, 4);

  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Agenda Kegiatan
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Jadwal Kegiatan dan Agenda Instansi
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
              Informasi agenda membantu masyarakat dan mitra kerja mengetahui
              kegiatan, pembinaan, serta jadwal penting yang diselenggarakan
              instansi.
            </p>
          </div>

          <Link
            href="/agenda"
            className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-800 md:inline-flex"
          >
            Lihat Semua Agenda
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] bg-gradient-to-br from-emerald-50 to-white p-6 ring-1 ring-emerald-100 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                {featuredAgenda.status}
              </span>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                {featuredAgenda.category}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              {featuredAgenda.title}
            </h3>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Tanggal:</span>{" "}
                {featuredAgenda.date}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Waktu:</span>{" "}
                {featuredAgenda.time}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Lokasi:</span>{" "}
                {featuredAgenda.location}
              </p>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              {featuredAgenda.description}
            </p>

            <div className="mt-6">
              <Link
                href="/agenda"
                className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Buka Agenda
              </Link>
            </div>
          </article>

          <div className="space-y-4">
            {otherAgenda.map((item) => (
              <article
                key={item.slug}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-white"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.category}
                  </span>
                  <span className="text-sm text-slate-500">
                    {item.date} · {item.time}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  <span className="font-medium text-slate-700">Lokasi:</span>{" "}
                  {item.location}
                </p>
              </article>
            ))}

            <Link
              href="/agenda"
              className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800 md:hidden"
            >
              Lihat Semua Agenda
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}