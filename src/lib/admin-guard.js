// src/lib/admin-guard.js
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Semua role yang boleh masuk panel admin
const ALLOWED_ROLES = new Set(["admin", "super_admin", "editor"]);

function isAllowedRole(role) {
  return ALLOWED_ROLES.has(
    String(role || "")
      .trim()
      .toLowerCase(),
  );
}

export async function requireAdminAccess() {
  // Pakai server client (dengan session user) untuk auth check
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      status: 401,
      message: "Sesi tidak ditemukan. Silakan login kembali.",
      supabase: null,
      user: null,
      profile: null,
    };
  }

  // Pakai admin client (service role) untuk query profiles agar tidak kena RLS
  const adminSupabase = createAdminClient();

  const { data: profile, error: profileError } = await adminSupabase
    .from("profiles")
    .select("id, full_name, email, role, unit_name, avatar_url, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[admin-guard] profiles query error:", profileError.message);
    return {
      ok: false,
      status: 500,
      message: "Gagal memverifikasi profil pengguna.",
      supabase: adminSupabase,
      user,
      profile: null,
    };
  }

  if (!profile) {
    return {
      ok: false,
      status: 403,
      message: "Profil admin tidak ditemukan.",
      supabase: adminSupabase,
      user,
      profile: null,
    };
  }

  if (profile.is_active === false) {
    return {
      ok: false,
      status: 403,
      message: "Akun admin tidak aktif.",
      supabase: adminSupabase,
      user,
      profile,
    };
  }

  if (!isAllowedRole(profile.role)) {
    return {
      ok: false,
      status: 403,
      message: "Anda tidak memiliki hak akses ke panel admin.",
      supabase: adminSupabase,
      user,
      profile,
    };
  }

  return {
    ok: true,
    status: 200,
    message: "OK",
    // Kembalikan adminSupabase agar semua query di route.js bypass RLS
    supabase: adminSupabase,
    user,
    profile,
    role: profile.role,
  };
}
