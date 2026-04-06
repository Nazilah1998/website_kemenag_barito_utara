import { statistics } from "../data/statistics";

export default function StatisticsSection() {
  return (
    <section className="py-10">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-900 px-6 py-10 text-white shadow-sm md:px-8 md:py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Statistik Kemenag
          </p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            Gambaran Layanan dan Pembinaan di Barito Utara
          </h2>
          <p className="mt-3 text-sm leading-7 text-emerald-50/90 md:text-base">
            Informasi ringkas ini memberikan gambaran umum mengenai cakupan
            layanan, pembinaan kelembagaan, dan peran aktif Kementerian Agama
            Kabupaten Barito Utara dalam melayani masyarakat.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
            >
              <p className="text-3xl font-bold text-white md:text-4xl">
                {item.value}
              </p>

              <h3 className="mt-3 text-lg font-semibold text-white">
                {item.label}
              </h3>

              <p className="mt-2 text-sm leading-6 text-emerald-50/85">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}