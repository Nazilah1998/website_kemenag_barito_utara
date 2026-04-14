import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

const ADMIN_ROLES = new Set(["admin", "super_admin"]);
const EDITOR_ROLES = new Set(["admin", "super_admin", "editor"]);

function normalizeRole(role) {
  if (!role || typeof role !== "string") return null;
  return role.trim().toLowerCase();
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
          // aman pada context yang tidak mengizinkan set cookie
        }
      },
    },
  });
}

async function getAdminMfaContext(supabase) {
  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error) {
    if (isMissingSessionError(error)) {
      return {
        currentLevel: null,
        nextLevel: null,
        isVerified: false,
      };
    }
    throw error;
  }

  return {
    currentLevel: data?.currentLevel ?? null,
    nextLevel: data?.nextLevel ?? null,
    isVerified: data?.currentLevel === "aal2",
  };
}

export async function getCurrentSessionContext() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    if (isMissingSessionError(userError)) {
      return {
        isAuthenticated: false,
        claims: null,
        user: null,
        profile: null,
        role: null,
        isAdmin: false,
        isEditor: false,
        aal: null,
        nextAal: null,
        isMfaVerified: false,
        mfaErrorMessage: null,
      };
    }

    throw userError;
  }

  if (!user) {
    return {
      isAuthenticated: false,
      claims: null,
      user: null,
      profile: null,
      role: null,
      isAdmin: false,
      isEditor: false,
      aal: null,
      nextAal: null,
      isMfaVerified: false,
      mfaErrorMessage: null,
    };
  }

  let profile = null;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError && profileError.code !== "PGRST116") {
    throw profileError;
  }

  profile = profileData ?? {
    id: user.id,
    email: user.email ?? null,
    full_name:
      user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    role: user.app_metadata?.role ?? user.user_metadata?.role ?? null,
  };

  const role = normalizeRole(profile?.role);
  const isAdmin = ADMIN_ROLES.has(role);
  const isEditor = EDITOR_ROLES.has(role);

  let aal = null;
  let nextAal = null;
  let isMfaVerified = !isAdmin;
  let mfaErrorMessage = null;

  if (isAdmin) {
    try {
      const mfa = await getAdminMfaContext(supabase);
      aal = mfa.currentLevel;
      nextAal = mfa.nextLevel;
      isMfaVerified = mfa.isVerified;
    } catch (error) {
      isMfaVerified = false;
      mfaErrorMessage = error?.message || "Gagal memeriksa status MFA admin.";
    }
  }

  return {
    isAuthenticated: true,
    claims: {
      sub: user.id,
      email: user.email ?? null,
    },
    user,
    profile,
    role,
    isAdmin,
    isEditor,
    aal,
    nextAal,
    isMfaVerified,
    mfaErrorMessage,
  };
}

export async function requireAdmin(options = {}) {
  const {
    loginRedirect = "/admin/login",
    forbiddenRedirect = "/error?message=" +
      encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
    mfaRedirect = "/admin/mfa",
    requireMfa = true,
  } = options;

  const session = await getCurrentSessionContext();

  if (!session.isAuthenticated) {
    redirect(loginRedirect);
  }

  if (!session.isAdmin) {
    redirect(forbiddenRedirect);
  }

  if (requireMfa && !session.isMfaVerified) {
    redirect(mfaRedirect);
  }

  return session;
}
