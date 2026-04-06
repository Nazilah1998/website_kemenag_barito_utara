import { introData } from "../data/intro";

export default function IntroSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-colors dark:bg-slate-900 dark:ring-slate-800 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          {introData.badge}
        </p>

        <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {introData.title}
        </h2>

        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
          {introData.description}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {introData.features.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 transition-colors dark:bg-slate-950 dark:ring-slate-800"
            >
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-colors dark:bg-slate-900 dark:ring-slate-800 md:p-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Informasi Penting
        </h3>

        <div className="mt-5 space-y-3">
          {introData.highlights.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}