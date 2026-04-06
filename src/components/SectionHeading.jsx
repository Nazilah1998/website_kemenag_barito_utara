import Link from "next/link";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  actionExternal = false,
  align = "left",
}) {
  const alignmentClass =
    align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  return (
    <div
      className={`${alignmentClass} flex flex-col gap-4 md:flex-row md:items-end md:justify-between`}
    >
      <div className={align === "center" ? "w-full" : ""}>
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
            {description}
          </p>
        )}
      </div>

      {actionLabel && actionHref &&
        (actionExternal ? (
          <a
            href={actionHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
          >
            {actionLabel}
          </a>
        ) : (
          <Link
            href={actionHref}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
          >
            {actionLabel}
          </Link>
        ))}
    </div>
  );
}