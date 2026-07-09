import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { logWarn, logError } from "@/lib/logger";
import { db } from "@/lib/drizzle";
import { pusdatinUsers, admin_users } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);
const EDITOR_ROLES = new Set(["editor", "admin", "super_admin"]);
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || null;

interface SupabaseUser {
  id?: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

interface ProfileRecord {
  id?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface SessionContext {
  supabase?: unknown;
  user: SupabaseUser | null;
  profile: ProfileRecord | null;
  claims: Record<string, unknown>;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  hasAdminAccess: boolean;
}

export function normalizeRole(role: unknown): string | null {
  if (!role || typeof role !== "string") return null;
  const normalized = role.trim().toLowerCase();
  return normalized || null;
}

function isMissingSessionError(error: unknown): boolean {
  const err = error as { message?: string; code?: string };
  const message = String(err?.message || "").toLowerCase();
  const code = String(err?.code || "").toLowerCase();
  return (
    message.includes("auth session missing") ||
    message.includes("session missing") ||
    code.includes("session") ||
    code === "auth_session_missing"
  );
}

function buildForbiddenUrl(message: string, fallback = "/error"): string {
  return `${fallback}?message=${encodeURIComponent(message)}`;
}

export async function createServerSupabaseClient(): Promise<unknown> {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookieOptions: {
      name: "sb-website-auth-token",
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // ignore
        }
      },
    },
  });
}

async function getUserProfile(userId: string | null): Promise<ProfileRecord | null> {
  if (!userId) return null;

  try {
    const [profile] = await db
      .select()
      .from(pusdatinUsers)
      .where(eq(pusdatinUsers.id, userId))
      .limit(1);

    if (profile) return profile as unknown as ProfileRecord;

    const [adminUser] = await db
      .select()
      .from(admin_users)
      .where(eq(admin_users.user_id, userId))
      .limit(1);

    if (adminUser) {
      return {
        ...adminUser,
        id: (adminUser as unknown as Record<string, unknown>).user_id as string,
        role: (adminUser as unknown as Record<string, unknown>).role as string,
      } as unknown as ProfileRecord;
    }

    return null;
  } catch (error) {
    logError("getUserProfile_error", { error: error as Error });
    return null;
  }
}

export async function getCurrentSessionContext(): Promise<SessionContext> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await (supabase as any).auth.getUser();

  if (userError && !isMissingSessionError(userError)) {
    throw userError;
  }

  if (!user) {
    return {
      supabase,
      user: null,
      profile: null,
      claims: {},
      role: null,
      isAuthenticated: false,
      isAdmin: false,
      isEditor: false,
      hasAdminAccess: false,
    };
  }

  const profile = await getUserProfile(user.id);

  const currentEmail = String(user?.email || profile?.email || "")
    .trim()
    .toLowerCase();

  let profileRole = normalizeRole(profile?.role);

  if (SUPER_ADMIN_EMAIL && currentEmail === SUPER_ADMIN_EMAIL) {
    logWarn("SUPER_ADMIN_EMAIL_override", { email: currentEmail });
    profileRole = "super_admin";
  } else if (!profileRole) {
    try {
      const [adminRow] = await (db as any)
        .select({ role: admin_users.role })
        .from(admin_users)
        .where(eq(admin_users.user_id, user.id))
        .limit(1);

      if (adminRow) {
        profileRole = normalizeRole(adminRow.role);
      }
    } catch {
      // ignore
    }
  }

  const role = normalizeRole(
    profileRole ||
      (user?.app_metadata?.role as string) ||
      (user?.user_metadata?.role as string) ||
      null,
  );

  const isAdmin = ADMIN_ROLES.has(role as string);
  const isEditor = EDITOR_ROLES.has(role as string);

  return {
    supabase,
    user,
    profile,
    claims: (user?.app_metadata || {}) as Record<string, unknown>,
    role,
    isAuthenticated: true,
    isAdmin,
    isEditor,
    hasAdminAccess: isAdmin || isEditor,
  };
}

export async function requireAuth({ loginRedirect = "/login" } = {}): Promise<SessionContext> {
  const session = await getCurrentSessionContext();

  if (!session.isAuthenticated) {
    redirect(loginRedirect);
  }

  return session;
}

export async function requireEditor({
  loginRedirect = "/admin/login",
  forbiddenRedirect = buildForbiddenUrl(
    "Akun ini tidak memiliki hak akses editor.",
  ),
} = {}): Promise<SessionContext> {
  const session = await requireAuth({ loginRedirect });

  if (!session.isEditor) {
    redirect(forbiddenRedirect);
  }

  return session;
}

export async function requireAdmin({
  loginRedirect = "/admin/login",
  forbiddenRedirect = buildForbiddenUrl(
    "Akun ini tidak memiliki hak akses admin.",
  ),
} = {}): Promise<SessionContext> {
  const session = await requireAuth({ loginRedirect });

  if (!session.isAdmin) {
    redirect(forbiddenRedirect);
  }

  return session;
}

export async function requireAdminAccess({
  loginRedirect = "/admin/login",
  forbiddenRedirect = buildForbiddenUrl(
    "Akun ini tidak memiliki hak akses untuk masuk panel admin.",
  ),
} = {}): Promise<SessionContext> {
  const session = await requireAuth({ loginRedirect });

  if (!session.hasAdminAccess) {
    redirect(forbiddenRedirect);
  }

  return session;
}
