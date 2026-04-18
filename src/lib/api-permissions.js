import { getCurrentSessionContext } from "@/lib/auth";
import {
  getUserPermissionContext,
  hasUserPermission,
} from "@/lib/user-permissions";
import { ROLES } from "@/lib/permissions";

export async function requireApiPermission(permission) {
  const session = await getCurrentSessionContext();

  if (!session?.isAuthenticated) {
    return {
      ok: false,
      status: 401,
      message: "Anda belum login.",
      session,
      permissionContext: null,
    };
  }

  if (!session?.isEditor && !session?.isAdmin) {
    return {
      ok: false,
      status: 403,
      message: "Akun ini tidak memiliki akses admin/editor.",
      session,
      permissionContext: null,
    };
  }

  const userId = session?.profile?.id || session?.user?.id || null;
  const role = session?.role || null;
  const email = session?.profile?.email || session?.user?.email || null;

  const permissionContext = await getUserPermissionContext({
    userId,
    role,
    email,
  });

  if (permissionContext.isSuperAdmin || role === ROLES.ADMIN) {
    return {
      ok: true,
      status: 200,
      message: "OK",
      session,
      permissionContext,
    };
  }

  if (!permissionContext.approved || !permissionContext.isActive) {
    return {
      ok: false,
      status: 403,
      message: "Akun editor belum aktif atau belum disetujui.",
      session,
      permissionContext,
    };
  }

  if (!hasUserPermission(permissionContext, permission)) {
    return {
      ok: false,
      status: 403,
      message: "Anda tidak memiliki izin untuk aksi ini.",
      session,
      permissionContext,
    };
  }

  return {
    ok: true,
    status: 200,
    message: "OK",
    session,
    permissionContext,
  };
}
