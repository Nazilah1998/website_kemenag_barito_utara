// src/components/admin/laporan/LaporanCategoryPanel.jsx
"use client";

export default function LaporanCategoryPanel({
    categories = [],
    activeSlug,
    activeCategory,
    loadingSlug,
    onSwitchCategory,
}) {
    if (categories.length === 0) {
        return (
            <div>
                <h2 className="mb-1 text-base font-bold text-slate-900 dark:text-slate-100">
                    Pilih Kategori
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Belum ada kategori laporan. Tambah kategori terlebih dahulu.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2
                id="laporan-kategori-title"
                className="mb-1 text-base font-bold text-slate-900 dark:text-slate-100"
            >
                Pilih Kategori
            </h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                Pilih submenu laporan. Daftar dokumen dan form upload akan menyesuaikan
                kategori yang dipilih secara otomatis.
            </p>

            {/* BUG FIX: hapus role="list" dari div agar <button> di dalamnya
          tidak diwariskan role="listitem" yang tidak mendukung aria-pressed */}
            <div
                className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                aria-label="Daftar kategori laporan"
                aria-labelledby="laporan-kategori-title"
            >
                {categories.map((cat) => {
                    const isActive = activeSlug === cat.slug;
                    const isLoading = loadingSlug === cat.slug;
                    const docCount = Array.isArray(cat.documents)
                        ? cat.documents.length
                        : null;

                    return (
                        <button
                            key={cat.slug}
                            type="button"
                            onClick={() => onSwitchCategory(cat.slug)}
                            aria-pressed={isActive}
                            aria-busy={isLoading}
                            disabled={isLoading}
                            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-wait ${isActive
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40"
                                }`}
                        >
                            <span className="truncate">{cat.title}</span>

                            <span className="ml-2 shrink-0">
                                {isLoading ? (
                                    <span
                                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                                        aria-hidden="true"
                                    />
                                ) : docCount !== null ? (
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive
                                            ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200"
                                            : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                                            }`}
                                    >
                                        {docCount}
                                    </span>
                                ) : null}
                            </span>
                        </button>
                    );
                })}
            </div>

            {activeCategory ? (
                <div
                    className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/40"
                    role="status"
                    aria-live="polite"
                >
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                        {activeCategory.title}
                    </p>
                    {activeCategory.description ? (
                        <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-400">
                            {activeCategory.description}
                        </p>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}