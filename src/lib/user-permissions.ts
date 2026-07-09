import { redirect } from "next/navigation";
import { getCurrentSessionContext } from "@/lib/auth";
import type { SessionContext } from "@/lib/auth";
import { ROLES, getRolePermissions } from "@/lib/permissions";
import { db } from "@/lib/drizzle";
import { pusdatinUsers, pusdatinAppPermissions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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
  const sessionRole = String(role || "")
    .trim()
    .toLowerCase();

  if (!userId) {
    return {
      role: sessionRole || null,
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

  let dbUser: { email?: string | null; status?: string | null; role?: string | null } | null = null;
  let dbPerms: { role?: string | null; features?: any } | null = null;
  let approved = false;
  let isActive = false;
  let resolvedRole = sessionRole;
  let customPermissions: string[] = [];

  try {
    const [usersRes, permsRes] = await Promise.all([
      db
        .select({
          id: pusdatinUsers.id,
          email: pusdatinUsers.email,
          role: pusdatinUsers.role,
          status: pusdatinUsers.status,
        })
        .from(pusdatinUsers)
        .where(eq(pusdatinUsers.id, userId as string))
        .limit(1),
      db
        .select({
          role: pusdatinAppPermissions.role,
          features: pusdatinAppPermissions.features,
        })
        .from(pusdatinAppPermissions)
        .where(
          and(
            eq(pusdatinAppPermissions.userId, userId as string),
            eq(pusdatinAppPermissions.appId, "website-kemenag")
          )
        )
        .limit(1),
    ]);

    dbUser = usersRes[0] || null;
    dbPerms = permsRes[0] || null;

    if (dbUser) {
      isActive = dbUser.status === "active";
      if (dbUser.role === "super_admin") {
        resolvedRole = "super_admin";
        approved = true;
      } else if (dbPerms) {
        resolvedRole = dbPerms.role || "editor";
        approved = true;
        
        if (Array.isArray(dbPerms.features)) {
          customPermissions = dbPerms.features
            .map((f: any) => typeof f === 'object' && f !== null ? f.id : String(f))
            .filter(Boolean);
        }
      }
    }
  } catch (error) {
    logError("permission_context_core_query_failed", {
      userId,
      error: error as Error,
    });
    dbUser = null;
    dbPerms = null;
    approved = false;
    isActive = false;
  }

  const basePermissions = getRolePermissions(resolvedRole);
  const allPermissions = Array.from(new Set([...basePermissions, ...customPermissions]));
  
  const isSuperAdmin = resolvedRole === ROLES.SUPER_ADMIN;
  const isRoleAdmin = isSuperAdmin || resolvedRole === ROLES.ADMIN;

  return {
    role: resolvedRole || null,
    email: dbUser?.email || email || null,
    isSuperAdmin,
    isAdmin: isRoleAdmin,
    isEditor: resolvedRole === ROLES.EDITOR || isRoleAdmin,
    isActive,
    approved,
    requestStatus: approved ? "approved" : "pending",
    permissions: (approved && isActive) ? (allPermissions as string[]) : [],
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
