import { login, signup } from "./actions";

export const metadata = {
  title: "Login Admin",
};

export default async function LoginPage({ searchParams }) {
  const next = searchParams?.next || "/admin";

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-2xl font-semibold">Masuk ke panel admin</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Gunakan akun admin/editor Supabase untuk mengelola berita,
            pengumuman, dokumen publik, dan agenda.
          </p>

          <form className="mt-6 space-y-4">
            <input type="hidden" name="next" defaultValue={next} />
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none dark:border-gray-700 dark:bg-gray-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none dark:border-gray-700 dark:bg-gray-950"
              />
            </div>
            <button
              formAction={login}
              className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white"
            >
              Login
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-2xl font-semibold">Buat akun editor</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Tahap awal ini cocok untuk menyiapkan akun editor pertama. Role akun
            dapat diubah dari SQL Editor Supabase setelah pendaftaran.
          </p>

          <form className="mt-6 space-y-4">
            <input type="hidden" name="next" defaultValue={next} />
            <div>
              <label className="mb-1 block text-sm font-medium">Nama lengkap</label>
              <input
                name="full_name"
                type="text"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none dark:border-gray-700 dark:bg-gray-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none dark:border-gray-700 dark:bg-gray-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none dark:border-gray-700 dark:bg-gray-950"
              />
            </div>
            <button
              formAction={signup}
              className="w-full rounded-xl border border-green-700 px-4 py-3 font-medium text-green-700 dark:text-green-400"
            >
              Daftar
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
