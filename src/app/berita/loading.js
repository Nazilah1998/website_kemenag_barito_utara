export default function BeritaLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 px-6 py-12 text-white md:px-10">
        <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
        <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded bg-white/20" />
        <div className="mt-4 h-4 w-[32rem] max-w-full animate-pulse rounded bg-white/20" />
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
          >
            <div className="h-48 animate-pulse bg-slate-200" />
            <div className="p-6">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-6 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-6 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-200" />
              <div className="mt-5 h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}