export default function BeritaLoading() {
  return (
    <>
      {/* Banner Skeleton */}
      <div className="relative w-full h-[250px] md:h-[350px] bg-slate-200 dark:bg-slate-800 animate-pulse" />

      <main className="bg-slate-50 transition-colors dark:bg-slate-950 overflow-hidden min-h-screen">
        <section className="w-full px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
          {/* Filters Skeleton */}
          <div className="h-24 sm:h-32 w-full rounded-[2rem] sm:rounded-[2.5rem] bg-slate-200/70 dark:bg-slate-800/50 animate-pulse mb-10" />

          {/* Featured News Skeleton */}
          <div className="relative mb-10 h-[300px] lg:h-[400px] w-full rounded-3xl bg-slate-200/70 dark:bg-slate-800/50 animate-pulse" />

          {/* Title Area Skeleton */}
          <div className="mt-10 mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mb-2" />
              <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
            </div>
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
          </div>

          {/* Grid Skeleton */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 p-2 sm:p-3 pb-6">
                <div className="h-32 sm:h-48 w-full rounded-[1.25rem] bg-slate-200/70 dark:bg-slate-800/50 animate-pulse mb-4" />
                <div className="px-3 flex flex-col gap-3">
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                    <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                  </div>
                  <div className="h-5 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                  <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}