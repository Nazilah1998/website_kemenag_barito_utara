import { requireAdmin } from "@/lib/auth";
import { listAudit } from "@/lib/audit";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function formatDate(iso) {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function ActionBadge({ action }) {
  const tones = {
    create: "bg-emerald-100 text-emerald-700",
    update: "bg-sky-100 text-sky-700",
    delete: "bg-rose-100 text-rose-700",
    publish: "bg-amber-100 text-amber-700",
    unpublish: "bg-slate-100 text-slate-700",
    login: "bg-indigo-100 text-indigo-700",
    logout: "bg-slate-100 text-slate-700",
    role_change: "bg-violet-100 text-violet-700",
  };
  const cls = tones[action] || "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${cls}`}
    >
      {action}
    </span>
  );
}

export default async function AdminAuditPage() {
  const session = await requireAdmin();

  if (!hasPermission(session.role, PERMISSIONS.AUDIT_VIEW)) {
    redirect(
      "/error?message=" +
        encodeURIComponent("Anda tidak memiliki izin melihat audit log."),
    );
  }

  const result = await listAudit({ limit: 100 });
  const items = result.items || [];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Audit Log
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Riwayat Aktivitas Admin
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Menampilkan 100 aktivitas terbaru. Gunakan log ini untuk audit internal
          dan investigasi perubahan konten.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Entitas</th>
                <th className="px-4 py-3">Ringkasan</th>
                <th className="px-4 py-3">Pelaku</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-sm text-slate-500"
                    colSpan={5}
                  >
                    Belum ada aktivitas tercatat.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <ActionBadge action={item.action} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="font-medium">{item.entity}</span>
                      {item.entity_id ? (
                        <span className="ml-1 text-xs text-slate-400">
                          #{String(item.entity_id).slice(0, 8)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.summary || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <div className="font-medium">
                        {item.actor_email || "-"}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.actor_role || "-"}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
