import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentSessionContext } from "@/lib/auth";
import { ROLES, getRolePermissions } from "@/lib/permissions";

function forbiddenUrl(
  message = "Anda tidak memiliki izin untuk mengakses halaman ini.",
) {
  return `/error?message=${encodeURIComponent(message)}`;
}

export async function getUserPermissionContext({
  userId,
  role,
  email = null,
} = {}) {
  const normalizedRole = String(role || "")
    .trim()
    .toLowerCase();
  const basePermissions = new Set(getRolePermissions(normalizedRole));

  if (!userId) {
    return {
      role: normalizedRole || null,
      email,
      isSuperAdmin: false,
      isAdmin: false,
      isEditor: false,
      isActive: false,
      approved: false,
      requestStatus: null,
      permissions: [],
    };
  }

  if (normalizedRole === ROLES.SUPER_ADMIN) {
    return {
      role: normalizedRole,
      email,
      isSuperAdmin: true,
      isAdmin: true,
      isEditor: true,
      isActive: true,
      approved: true,
      requestStatus: "approved",
      permissions: [...basePermissions],
    };
  }

  if (normalizedRole === ROLES.ADMIN) {
    return {
      role: normalizedRole,
      email,
      isSuperAdmin: false,
      isAdmin: true,
      isEditor: true,
      isActive: true,
      approved: true,
      requestStatus: "approved",
      permissions: [...basePermissions],
    };
  }

  const supabase = createAdminClient();

  const [{ data: profile }, { data: request }, { data: rows }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, role, is_active")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("editor_requests")
        .select("status")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("user_permissions")
        .select("permission")
        .eq("user_id", userId),
    ]);

  const requestStatus = request?.status || null;
  const approved = requestStatus === "approved";
  const isActive = Boolean(profile?.is_active);
  const customPermissions = Array.isArray(rows)
    ? rows.map((item) => item.permission).filter(Boolean)
    : [];

  return {
    role: normalizedRole || null,
    email: profile?.email || email || null,
    isSuperAdmin: false,
    isAdmin: false,
    isEditor: normalizedRole === ROLES.EDITOR,
    isActive,
    approved,
    requestStatus,
    permissions: approved && isActive ? customPermissions : [],
  };
}

export function hasUserPermission(permissionContext, permission) {
  if (!permissionContext || !permission) return false;
  if (permissionContext.isSuperAdmin) return true;
  return Array.isArray(permissionContext.permissions)
    ? permissionContext.permissions.includes(permission)
    : false;
}

export function hasAnyUserPermission(permissionContext, permissions = []) {
  if (!permissions.length) return false;
  return permissions.some((permission) =>
    hasUserPermission(permissionContext, permission),
  );
}

export async function getCurrentUserPermissionContext() {
  const session = await getCurrentSessionContext();

  const userId = session?.profile?.id || session?.user?.id || null;
  const role = session?.role || null;
  const email = session?.profile?.email || session?.user?.email || null;

  const permissionContext = await getUserPermissionContext({
    userId,
    role,
    email,
  });

  return {
    session,
    permissionContext,
  };
}

export async function requirePermission(
  permission,
  {
    loginRedirect = "/admin/login",
    forbiddenRedirect = forbiddenUrl(),
    inactiveRedirect = forbiddenUrl(
      "Akun editor belum aktif atau belum disetujui.",
    ),
  } = {},
) {
  const { session, permissionContext } =
    await getCurrentUserPermissionContext();

  if (!session?.isAuthenticated) {
    redirect(loginRedirect);
  }

  if (!session?.isEditor && !session?.isAdmin) {
    redirect(forbiddenRedirect);
  }

  if (permissionContext.isSuperAdmin) {
    return { session, permissionContext };
  }

  if (session?.role === ROLES.ADMIN) {
    return { session, permissionContext };
  }

  if (!permissionContext.approved || !permissionContext.isActive) {
    redirect(inactiveRedirect);
  }

  if (!hasUserPermission(permissionContext, permission)) {
    redirect(forbiddenRedirect);
  }

  return { session, permissionContext };
}
