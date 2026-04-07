import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdmin({
    loginRedirect: "/admin/login",
    forbiddenRedirect:
      "/error?message=" +
      encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
  });

  const user = session.profile;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Admin Panel
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Selamat datang di dashboard admin
          </h1>

          <p className="mt-2 text-slate-600">
            Login Supabase berhasil. Akses admin aktif dan siap dipakai.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {user?.email || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Nama</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {user?.full_name || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Role</p>
              <p className="mt-2 text-base font-semibold text-emerald-700">
                {user?.role || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}