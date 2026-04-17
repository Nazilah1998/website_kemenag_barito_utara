"use client";

export default function LaporanCategoryPanel({
    categories = [],
    activeSlug,
    activeCategory,
    loadingSlug,
    onSwitchCategory,
}) {
    return (
        <section
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            aria-labelledby="laporan-kategori-title"
        >
            <h2
                id="laporan-kategori-title"
                className="mb-1 text-base font-bold text-slate-900"
            >
                Pilih Kategori
            </h2>
            <p className="mb-4 text-sm text-slate-500">
                Pilih submenu laporan. Daftar dokumen dan form upload di bawah akan
                menyesuaikan kategori yang dipilih secara otomatis.
            </p>

            <div
                className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                role="list"
                aria-label="Daftar kategori laporan"
            >
                {categories.map((cat) => {
                    const isActive = activeSlug === cat.slug;
                    const isLoading = loadingSlug === cat.slug;

                    return (
                        <button
                            key={cat.slug}
                            type="button"
                            onClick={() => onSwitchCategory(cat.slug)}
                            aria-pressed={isActive}
                            aria-busy={isLoading}
                            className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${isActive
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                                }`}
                        >
                            <span>{cat.title}</span>
                            {isLoading ? (
                                <span className="ml-2 text-xs font-normal text-slate-400">
                                    Memuat…
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>

            {activeCategory ? (
                <div
                    className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3"
                    role="status"
                    aria-live="polite"
                >
                    <p className="text-sm font-bold text-emerald-900">
                        {activeCategory.title}
                    </p>
                    {activeCategory.description ? (
                        <p className="mt-1 text-sm leading-6 text-emerald-800">
                            {activeCategory.description}
                        </p>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
}