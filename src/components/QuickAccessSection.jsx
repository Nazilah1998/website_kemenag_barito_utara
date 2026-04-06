import Link from "next/link";
import { quickLinks } from "../data/quickLinks";

export default function QuickAccessSection() {
  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Akses Cepat
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
            Layanan dan Informasi Utama
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
            Pilih akses yang paling sering dibutuhkan masyarakat untuk
            mendapatkan informasi dan layanan dengan lebih cepat.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => {
            if (item.disabled) {
              return (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                      {item.badge}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      Segera hadir
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-700">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-5 inline-flex text-sm font-semibold text-slate-400">
                    Belum tersedia
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.badge}
                  </span>
                  <span className="text-sm text-emerald-700 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-5 inline-flex text-sm font-semibold text-emerald-700">
                  Buka halaman
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}