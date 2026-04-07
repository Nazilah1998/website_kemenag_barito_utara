import { requireAdmin } from "@/lib/auth";
import AdminAgendaManager from "@/components/admin/AdminAgendaManager";

export const dynamic = "force-dynamic";

export default async function AdminAgendaPage() {
  await requireAdmin({
    loginRedirect: "/admin/login",
    forbiddenRedirect:
      "/error?message=" +
      encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
  });

  return <AdminAgendaManager />;
}