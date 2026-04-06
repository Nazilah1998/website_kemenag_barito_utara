import Link from "next/link";
import { heroData } from "../data/hero";

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-700">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-16 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-24 xl:px-10">
        <div>
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
            {heroData.badge}
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {heroData.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
            {heroData.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={heroData.primaryButton.href}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-slate-100"
            >
              {heroData.primaryButton.label}
            </Link>

            <Link
              href={heroData.secondaryButton.href}
              className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {heroData.secondaryButton.label}
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {heroData.stats.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-center text-white backdrop-blur-sm"
              >
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="mt-1 text-sm text-white/80">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {heroData.cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-3xl border border-white/10 bg-white/10 p-6 text-white backdrop-blur-sm ${
                card.wide ? "sm:col-span-2" : ""
              }`}
            >
              <h3 className="text-2xl font-bold">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/85">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}