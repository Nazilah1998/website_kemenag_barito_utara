import Link from "next/link";
import { ctaData } from "../data/cta";

export default function CTASection() {
  return (
    <section className="mt-12">
      <div className="rounded-[28px] bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-700 px-6 py-10 text-white md:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">{ctaData.title}</h2>
            <p className="mt-3 text-base leading-8 text-white/85">
              {ctaData.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={ctaData.primaryButton.href}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-slate-100"
            >
              {ctaData.primaryButton.label}
            </Link>

            <Link
              href={ctaData.secondaryButton.href}
              className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {ctaData.secondaryButton.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}