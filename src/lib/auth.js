import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);
const EDITOR_ROLES = new Set(["editor", "admin", "super_admin"]);

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
        } catch {
          // Tidak semua context mengizinkan set cookie
        }
      },
    },
  });
}

async function getAdminMfaContext(supabase) {
  try {
    const { data, error } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error) {
      if (isMissingSessionError(error)) {
        return {
          currentLevel: null,
          nextLevel: null,
          isVerified: false,
          errorMessage: null,
        };
      }

      return {
        currentLevel: null,
        nextLevel: null,
        isVerified: false,
        errorMessage: error.message || "Gagal membaca status MFA.",
      };
    }

    return {
      currentLevel: data?.currentLevel ?? null,
      nextLevel: data?.nextLevel ?? null,
      isVerified: data?.currentLevel === "aal2",
      errorMessage: null,
    };
  } catch (error) {
    return {
      currentLevel: null,
      nextLevel: null,
      isVerified: false,
      errorMessage: error?.message || "Gagal membaca status MFA.",
    };
  }
}

async function getUserProfile(supabase, userId) {
  if (!userId) return null;

  const candidates = ["profiles", "admin_users", "users"];

  for (const table of candidates) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch {
      // lanjut ke kandidat berikutnya
    }
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
      aal: null,
      nextAal: null,
      isMfaVerified: false,
      mfaErrorMessage: null,
    };
  }

  const profile = await getUserProfile(supabase, user.id);
  const role = normalizeRole(
    profile?.role ||
      user?.app_metadata?.role ||
      user?.user_metadata?.role ||
      null,
  );

  const mfa = await getAdminMfaContext(supabase);

  return {
    supabase,
    user,
    profile,
    claims: user?.app_metadata || {},
    role,
    isAuthenticated: true,
    isAdmin: ADMIN_ROLES.has(role),
    isEditor: EDITOR_ROLES.has(role),
    aal: mfa.currentLevel,
    nextAal: mfa.nextLevel,
    isMfaVerified: mfa.isVerified,
    mfaErrorMessage: mfa.errorMessage,
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
