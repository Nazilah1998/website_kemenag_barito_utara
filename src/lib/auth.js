import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ADMIN_ROLES = new Set(["super_admin", "admin"]);
const EDITOR_ROLES = new Set(["super_admin", "admin", "editor"]);

export async function getCurrentSessionContext() {
  const supabase = await createClient();

  const claimsResult = await supabase.auth.getClaims();
  const claims = claimsResult?.data?.claims ?? null;
  const claimsError = claimsResult?.error ?? null;

  if (claimsError || !claims?.sub) {
    return {
      supabase,
      claims: null,
      profile: null,
      role: null,
      isAuthenticated: false,
      isAdmin: false,
      isEditor: false,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, unit_name, is_active")
    .eq("id", claims.sub)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  const role = profile?.role ?? null;

  return {
    supabase,
    claims,
    profile,
    role,
    isAuthenticated: Boolean(claims?.sub),
    isAdmin: ADMIN_ROLES.has(role),
    isEditor: EDITOR_ROLES.has(role),
  };
}

export async function requireAuthenticated(options = {}) {
  const { redirectTo = "/login" } = options;
  const session = await getCurrentSessionContext();

  if (!session.isAuthenticated) {
    redirect(redirectTo);
  }

  return session;
}

export async function requireAdmin(options = {}) {
  const {
    loginRedirect = "/admin/login",
    forbiddenRedirect = "/error?code=403",
  } = options;

  const session = await getCurrentSessionContext();

  if (!session.isAuthenticated) {
    redirect(loginRedirect);
  }

  if (!session.isAdmin) {
    redirect(forbiddenRedirect);
  }

  return session;
}

export async function requireEditor(options = {}) {
  const {
    loginRedirect = "/admin/login",
    forbiddenRedirect = "/error?code=403",
  } = options;

  const session = await getCurrentSessionContext();

  if (!session.isAuthenticated) {
    redirect(loginRedirect);
  }

  if (!session.isEditor) {
    redirect(forbiddenRedirect);
  }

  return session;
}