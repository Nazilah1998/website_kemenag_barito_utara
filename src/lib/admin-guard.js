import { createClient } from "@/lib/supabase/server";

function isAdminRole(role) {
  return (
    String(role || "")
      .trim()
      .toLowerCase() === "admin"
  );
}

export async function requireAdminAccess() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      status: 401,
      message: "Authentication required.",
      supabase,
      user: null,
      profile: null,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, unit_name, avatar_url, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[admin-guard] profiles query error:", profileError);

    return {
      ok: false,
      status: 500,
      message: "Gagal memverifikasi profil pengguna.",
      supabase,
      user,
      profile: null,
    };
  }

  if (!profile) {
    return {
      ok: false,
      status: 403,
      message: "Profil admin tidak ditemukan.",
      supabase,
      user,
      profile: null,
    };
  }

  if (profile.is_active === false) {
    return {
      ok: false,
      status: 403,
      message: "Akun admin tidak aktif.",
      supabase,
      user,
      profile,
    };
  }

  if (!isAdminRole(profile.role)) {
    return {
      ok: false,
      status: 403,
      message: "Admin access required.",
      supabase,
      user,
      profile,
    };
  }

  return {
    ok: true,
    status: 200,
    message: "OK",
    supabase,
    user,
    profile,
  };
}
