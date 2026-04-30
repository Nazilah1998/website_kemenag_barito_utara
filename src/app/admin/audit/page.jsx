import { redirect } from "next/navigation";
import { getCurrentUserPermissionContext } from "@/lib/user-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import AdminAuditManager from "@/components/features/admin/AdminAuditManager";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const { session, permissionContext } = await getCurrentUserPermissionContext();

  if (!session?.isAuthenticated) {
    redirect("/admin/login");
  }

  if (!session?.isEditor && !session?.isAdmin) {
    redirect(
      "/error?message=" +
      encodeURIComponent("Anda tidak memiliki akses ke panel admin."),
    );
  }

  if (
    !permissionContext?.isSuperAdmin &&
    !permissionContext?.permissions?.includes(PERMISSIONS.AUDIT_VIEW)
  ) {
    redirect(
      "/error?message=" +
      encodeURIComponent("Anda tidak memiliki izin melihat audit log."),
    );
  }

  return <AdminAuditManager />;
}
