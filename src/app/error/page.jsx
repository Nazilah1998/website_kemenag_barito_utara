export const metadata = {
  title: "Terjadi kesalahan",
};

export default async function ErrorPage({ searchParams }) {
  const params = await searchParams;

  const message =
    typeof params?.message === "string" && params.message.trim()
      ? params.message
      : "Permintaan tidak dapat diproses. Silakan periksa konfigurasi Supabase dan hak akses akun.";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Terjadi kesalahan</h1>
      <p className="mt-4 text-slate-600">{message}</p>
    </main>
  );
}