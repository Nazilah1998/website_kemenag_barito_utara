import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

function normalizeRole(role) {
  if (!role || typeof role !== "string") {
    return null;
  }

  return role.trim().toLowerCase();
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL belum diatur.");
  }

  if (!anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY belum diatur.");
  }

  return createServerClient(supabaseUrl, anonKey, {
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
          // Di beberapa context server component, set cookie bisa tidak diizinkan.
        }
      },
    },
  });
}

export async function getCurrentSessionContext() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      isEditor: false,
      role: null,
      claims: null,
      profile: null,
      user: null,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message || "Gagal membaca profil pengguna.");
  }

  const role = normalizeRole(profile?.role);
  const isAdmin = role === "admin";
  const isEditor = role === "admin" || role === "editor";

  return {
    isAuthenticated: true,
    isAdmin,
    isEditor,
    role,
    claims: user,
    profile: profile || {
      id: user.id,
      email: user.email ?? null,
      full_name: user.user_metadata?.full_name ?? null,
      role: null,
    },
    user,
  };
}

export async function requireAdmin(options = {}) {
  const {
    loginRedirect = "/admin/login",
    forbiddenRedirect = "/error?message=" + encodeURIComponent("Akses ditolak."),
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
    forbiddenRedirect = "/error?message=" + encodeURIComponent("Akses ditolak."),
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