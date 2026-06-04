import { redirect } from "next/navigation";
import { getCurrentSessionContext } from "@/lib/auth";
import type { SessionContext } from "@/lib/auth";
import { ROLES, getRolePermissions } from "@/lib/permissions";
import { db } from "@/lib/drizzle";
import { profiles, editor_requests, user_permissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logError } from "@/lib/logger";

function forbiddenUrl(
  message = "Anda tidak memiliki izin untuk mengakses halaman ini.",
): string {
  return `/error?message=${encodeURIComponent(message)}`;
}

export interface PermissionContext {
  role: string | null;
  email: string | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isActive: boolean;
  approved: boolean;
  requestStatus: string | null;
  permissions: string[];
}

export async function getUserPermissionContext({
  userId,
  role,
  email = null,
}: {
  userId: string | null;
  role: string | null;
  email?: string | null;
}): Promise<PermissionContext> {
  const normalizedRole = String(role || "")
    .trim()
    .toLowerCase();

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
    const basePermissions = new Set(getRolePermissions(normalizedRole));
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

  let profile: { email?: string | null; is_active?: boolean } | null = null;
  let request: { status?: string | null } | null = null;
  let approved = false;
  let isActive = false;
  let requestStatus: string | null = null;

  try {
    // Keep critical auth state queries together.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profilesRes, requestsRes]: [any[], any[]] = await Promise.all([
      db
        .select({
          id: profiles.id,
          email: profiles.email,
          role: profiles.role,
          is_active: profiles.is_active,
        })
        .from(profiles)
        .where(eq(profiles.id, userId as string))
        .limit(1),
      db
        .select({ status: editor_requests.status })
        .from(editor_requests)
        .where(eq(editor_requests.user_id, userId as string))
        .limit(1),
    ]);

    profile = profilesRes[0] || null;
    request = requestsRes[0] || null;

    requestStatus = request?.status || null;
    approved = requestStatus === "approved";
    isActive = Boolean(profile?.is_active);
  } catch (error) {
    logError("permission_context_core_query_failed", {
      userId,
      error: error as Error,
    });
    profile = null;
    request = null;
    requestStatus = null;
    approved = false;
    isActive = false;
  }

  // Query custom permissions separately so transient DB issues here
  // don't break admin page rendering or auth flow.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let permissionsList: any[] = [];
  try {
    permissionsList = await db
      .select({ permission: user_permissions.permission })
      .from(user_permissions)
      .where(eq(user_permissions.user_id, userId as string));
  } catch (error) {
    logError("permission_query_failed", {
      userId,
      error: error as Error,
    });
    permissionsList = [];
  }

  const customPermissions = (permissionsList || [])
    .map((item: { permission?: string }) => item.permission)
    .filter(Boolean);

  return {
    role: normalizedRole || null,
    email: profile?.email || email || null,
    isSuperAdmin: false,
    isAdmin: false,
    isEditor: normalizedRole === ROLES.EDITOR,
    isActive,
    approved,
    requestStatus,
    permissions: approved && isActive ? (customPermissions as string[]) : [],
  };
}

export function hasUserPermission(
  permissionContext: PermissionContext | null,
  permission: string | null,
): boolean {
  if (!permissionContext || !permission) return false;
  if (permissionContext.isSuperAdmin) return true;
  return Array.isArray(permissionContext.permissions)
    ? permissionContext.permissions.includes(permission)
    : false;
}

export function hasAnyUserPermission(
  permissionContext: PermissionContext | null,
  permissions: string[] = [],
): boolean {
  if (!permissions.length) return false;
  return permissions.some((permission) =>
    hasUserPermission(permissionContext, permission),
  );
}

export async function getCurrentUserPermissionContext(): Promise<{
  session: SessionContext;
  permissionContext: PermissionContext;
}> {
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
  permission: string,
  {
    loginRedirect = "/admin/login",
    forbiddenRedirect = forbiddenUrl(),
    inactiveRedirect = forbiddenUrl(
      "Akun editor belum aktif atau belum disetujui.",
    ),
  } = {},
): Promise<{ session: SessionContext; permissionContext: PermissionContext }> {
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

  if (!permissionContext.approved || !permissionContext.isActive) {
    redirect(inactiveRedirect);
  }

  if (!hasUserPermission(permissionContext, permission)) {
    redirect(forbiddenRedirect);
  }

  return { session, permissionContext };
}
