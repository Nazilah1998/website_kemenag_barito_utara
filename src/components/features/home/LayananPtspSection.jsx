"use client";

import Image from "next/image";

export default function LayananPtspSection({ services = [] }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-8 lg:py-12 bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl opacity-50 dark:opacity-20" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-50 dark:opacity-20" />
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 relative z-10">
        <div className="text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400">
            LAYANAN MASYARAKAT
          </p>
          <h2 className="mt-2 text-2xl font-black leading-[1.1] text-slate-900 lg:text-4xl dark:text-white uppercase tracking-tight flex flex-col sm:flex-row items-center justify-center sm:flex-wrap gap-1 sm:gap-2">
            <span>Katalog Layanan</span>
            <span className="flex items-center gap-2">
              PTSP Si
              <Image
                src="/assets/icons/atak.png"
                alt="Si ATAK"
                width={100}
                height={40}
                className="h-[1.2em] w-auto object-contain inline-block -mt-1"
              />
            </span>
          </h2>
          <div className="mx-auto mt-4 max-w-2xl text-[10px] font-bold leading-relaxed text-slate-500 dark:text-slate-400 sm:text-xs">
            <span className="text-amber-500">S</span>istem{" "}
            <span className="text-amber-500">I</span>nformasi{" "}
            <span className="text-amber-500">A</span>dministrasi{" "}
            <span className="text-amber-500">T</span>erpadu L
            <span className="text-amber-500">A</span>yanan{" "}
            <span className="text-amber-500">K</span>eagamaan
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
          {services.map((service) => {
            const ptspUrl = process.env.NEXT_PUBLIC_PTSP_URL || "https://ptsp.kemenag-baritoutara.com";

            return (
              <a
                key={service.id}
                href={`${ptspUrl}/layanan/${service.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-md shadow-slate-200/50 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 aspect-[4/5]"
              >
                {/* Fallback Background (Gradient) */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] via-[#059669] to-[#047857] z-0 opacity-100 transition-opacity group-hover:opacity-90" />

                {/* Text overlay for fallback */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight mb-2 drop-shadow-md uppercase">
                    {service.name}
                  </h3>
                </div>

                {/* Actual Banner Image */}
                <Image
                  src={`${ptspUrl}/banners/${service.slug}.png`}
                  alt={`Banner ${service.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="z-20 object-cover opacity-100 transition-transform duration-500 group-hover:scale-[1.02]"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  unoptimized
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
