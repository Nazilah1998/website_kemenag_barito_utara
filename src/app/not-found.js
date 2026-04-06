import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-12">
      <section className="w-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Error 404
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Halaman yang Anda cari tidak ditemukan
          </h1>

          <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
            Maaf, halaman yang Anda buka mungkin sudah dipindahkan, dihapus,
            atau alamat URL yang dimasukkan belum tepat.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Kembali ke Beranda
            </Link>

            <Link
              href="/berita"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Lihat Halaman Berita
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold text-slate-900">Cek URL</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Pastikan alamat halaman ditulis dengan benar.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold text-slate-900">Kembali ke Menu</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Gunakan navigasi atas untuk membuka halaman utama.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold text-slate-900">Butuh Bantuan</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Hubungi admin atau buka halaman kontak resmi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}