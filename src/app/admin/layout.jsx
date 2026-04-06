import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/login/actions";

export default async function AdminLayout({ children }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-green-700">
              Portal Admin
            </p>
            <h1 className="text-lg font-semibold">
              Kemenag Barito Utara CMS Bootstrap
            </h1>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="text-right">
              <p className="font-medium">{session.profile?.full_name || "Admin"}</p>
              <p className="text-gray-500 dark:text-gray-400">
                {session.profile?.role || "admin"}
              </p>
            </div>
            <form>
              <button
                formAction={logout}
                className="rounded-xl border border-gray-300 px-4 py-2 dark:border-gray-700"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <nav className="space-y-2 text-sm">
            <Link className="block rounded-xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" href="/admin">
              Dashboard
            </Link>
            <Link className="block rounded-xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" href="/admin?module=berita">
              Berita
            </Link>
            <Link className="block rounded-xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" href="/admin?module=pengumuman">
              Pengumuman
            </Link>
            <Link className="block rounded-xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" href="/admin?module=dokumen">
              Dokumen Publik
            </Link>
            <Link className="block rounded-xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" href="/admin?module=agenda">
              Agenda
            </Link>
          </nav>
        </aside>

        <section>{children}</section>
      </div>
    </div>
  );
}
