import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

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

async function getUserProfile(supabase, userId) {
  if (!userId) return null;

  const candidates = [
    { table: "profiles", column: "id" },
    { table: "admin_users", column: "user_id" },
    { table: "users", column: "id" },
  ];

  for (const candidate of candidates) {
    try {
      const { data, error } = await supabase
        .from(candidate.table)
        .select("*")
        .eq(candidate.column, userId)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch {}
  }

  return null;
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
      // TAMBAHAN: flag gabungan untuk akses panel admin
      hasAdminAccess: false,
    };
  }

  const profile = await getUserProfile(supabase, user.id);

  const currentEmail = String(user?.email || profile?.email || "")
    .trim()
    .toLowerCase();

  let profileRole = normalizeRole(profile?.role);

  if (currentEmail === SUPER_ADMIN_EMAIL) {
    profileRole = "super_admin";
  } else {
    try {
      const { data: adminRow, error: adminRowError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!adminRowError) {
        const adminRole = normalizeRole(adminRow?.role);
        if (adminRole) {
          profileRole = adminRole;
        }
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
    // hasAdminAccess = true untuk semua role yang boleh masuk panel admin
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
