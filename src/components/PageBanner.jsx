import Link from "next/link";

export default function PageBanner({ title, description, breadcrumb = [] }) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-2 text-sm text-white/70"
          >
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;

              return (
                <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                  {item.href && !isLast ? (
                    <Link href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-white" : ""}>{item.label}</span>
                  )}

                  {!isLast && <span className="text-white/40">/</span>}
                </div>
              );
            })}
          </nav>
        )}

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">{title}</h1>

          {description && (
            <p className="mt-4 text-sm leading-7 text-white/80 md:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}