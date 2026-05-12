import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import prisma from "@/lib/prisma";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);
const EDITOR_ROLES = new Set(["editor", "admin", "super_admin"]);
const SUPER_ADMIN_EMAIL = "nazilahmuhammad1998@gmail.com";

export function normalizeRole(role) {
  if (!role || typeof role !== "string") return null;
  const normalized = role.trim().toLowerCase();
  return normalized || null;
}

function isMissingSessionError(error) {
  const message = String(error?.message || "").toLowerCase();
  const code = String(error?.code || "").toLowerCase();
  return (
    message.includes("auth session missing") ||
    message.includes("session missing") ||
    code.includes("session") ||
    code === "auth_session_missing"
  );
}

function buildForbiddenUrl(message, fallback = "/error") {
  return `${fallback}?message=${encodeURIComponent(message)}`;
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {}
      },
    },
  });
}

async function getUserProfile(userId) {
  if (!userId) return null;

  try {
    // Try profiles first
    const profile = await prisma.profiles.findUnique({
      where: { id: userId }
    });

    if (profile) return profile;

    // Fallback to admin_users if needed (though profiles should have it)
    const adminUser = await prisma.admin_users.findUnique({
      where: { user_id: userId }
    });

    if (adminUser) {
      return {
        ...adminUser,
        id: adminUser.user_id,
        role: adminUser.role
      };
    }

    return null;
  } catch (error) {
    console.error("getUserProfile error:", error);
    return null;
  }
}

export async function getCurrentSessionContext() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

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

  if (currentEmail === SUPER_ADMIN_EMAIL) {
    profileRole = "super_admin";
  } else if (!profileRole) {
    try {
      const adminRow = await prisma.admin_users.findUnique({
        where: { user_id: user.id },
        select: { role: true }
      });

      if (adminRow) {
        profileRole = normalizeRole(adminRow.role);
      }
    } catch {}
  }

  const role = normalizeRole(
    profileRole ||
      user?.app_metadata?.role ||
      user?.user_metadata?.role ||
      null,
  );

  const isAdmin = ADMIN_ROLES.has(role);
  const isEditor = EDITOR_ROLES.has(role);

  return {
    supabase,
    user,
    profile,
    claims: user?.app_metadata || {},
    role,
    isAuthenticated: true,
    isAdmin,
    isEditor,
    hasAdminAccess: isAdmin || isEditor,
  };
}

export async function requireAuth({ loginRedirect = "/login" } = {}) {
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
} = {}) {
  const session = await requireAuth({ loginRedirect });

  if (!session.isEditor) {
    redirect(forbiddenRedirect);
  }

  return session;
}

// requireAdmin tetap KETAT: hanya admin dan super_admin.
// Dipakai untuk halaman super admin saja (misal: manajemen editor, settings global).
export async function requireAdmin({
  loginRedirect = "/admin/login",
  forbiddenRedirect = buildForbiddenUrl(
    "Akun ini tidak memiliki hak akses admin.",
  ),
} = {}) {
  const session = await requireAuth({ loginRedirect });

  if (!session.isAdmin) {
    redirect(forbiddenRedirect);
  }

  return session;
}

// BARU: requireAdminAccess = boleh masuk panel admin, termasuk editor.
// Dipakai untuk layout admin dan halaman umum panel (bukan halaman super admin).
export async function requireAdminAccess({
  loginRedirect = "/admin/login",
  forbiddenRedirect = buildForbiddenUrl(
    "Akun ini tidak memiliki hak akses untuk masuk panel admin.",
  ),
} = {}) {
  const session = await requireAuth({ loginRedirect });

  if (!session.hasAdminAccess) {
    redirect(forbiddenRedirect);
  }

  return session;
}
