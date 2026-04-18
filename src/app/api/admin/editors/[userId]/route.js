import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request, context) {
  try {
    const session = await requireAdmin({
      loginRedirect: "/admin/login",
    });

    if (session?.role !== "super_admin") {
      return json(
        { message: "Hanya super admin yang dapat memproses editor." },
        403,
      );
    }

    const params = await context.params;
    const userId = params?.userId;

    if (!userId) {
      return json({ message: "User ID editor tidak valid." }, 400);
    }

    const body = await request.json().catch(() => ({}));
    const action = String(body?.action || "")
      .trim()
      .toLowerCase();

    const supabase = createAdminClient();
    const reviewerId = session?.profile?.id || session?.user?.id || null;
    const now = new Date().toISOString();

    if (action === "approve") {
      const { error: requestError } = await supabase
        .from("editor_requests")
        .update({
          status: "approved",
          reviewed_at: now,
          reviewed_by: reviewerId,
          updated_at: now,
        })
        .eq("user_id", userId);

      if (requestError) throw requestError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: "editor",
          updated_at: now,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { error: adminUserError } = await supabase
        .from("admin_users")
        .update({
          role: "editor",
          updated_at: now,
        })
        .eq("user_id", userId);

      if (adminUserError) throw adminUserError;

      return json({ message: "Editor berhasil di-approve." });
    }

    if (action === "reject") {
      const { error } = await supabase
        .from("editor_requests")
        .update({
          status: "rejected",
          reviewed_at: now,
          reviewed_by: reviewerId,
          updated_at: now,
        })
        .eq("user_id", userId);

      if (error) throw error;

      return json({ message: "Editor berhasil ditolak." });
    }

    if (action === "activate") {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          is_active: true,
          updated_at: now,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { error: adminUserError } = await supabase
        .from("admin_users")
        .update({
          is_active: true,
          updated_at: now,
        })
        .eq("user_id", userId);

      if (adminUserError) throw adminUserError;

      return json({ message: "Akun editor berhasil diaktifkan." });
    }

    if (action === "deactivate") {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          is_active: false,
          updated_at: now,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { error: adminUserError } = await supabase
        .from("admin_users")
        .update({
          is_active: false,
          updated_at: now,
        })
        .eq("user_id", userId);

      if (adminUserError) throw adminUserError;

      return json({ message: "Akun editor berhasil dinonaktifkan." });
    }

    return json({ message: "Aksi tidak dikenali." }, 400);
  } catch (error) {
    return json(
      { message: error?.message || "Gagal memproses data editor." },
      500,
    );
  }
}
