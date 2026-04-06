export const metadata = {
  title: "Terjadi kesalahan",
};

export default async function ErrorPage({ searchParams }) {
  const message =
    searchParams?.message ||
    "Permintaan tidak dapat diproses. Silakan periksa konfigurasi Supabase dan hak akses akun.";

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
        <h1 className="text-2xl font-semibold">Terjadi kesalahan</h1>
        <p className="mt-3 leading-7">{message}</p>
      </div>
    </main>
  );
}
