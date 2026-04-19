import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
const SUPER_ADMIN_EMAIL = "nazilahmuhammad1998@gmail.com";

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(request, context) {
  try {
    const session = await getCurrentSessionContext();

    if (!session?.isAuthenticated) {
      return json({ message: "Unauthorized." }, 401);
    }

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
    const currentUserId = session?.user?.id || null;
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

      return json({
        message:
          "Editor berhasil di-approve. Silakan tentukan role, permission, dan aktivasi akun.",
      });
    }

    if (action === "set_role") {
      const nextRole = String(body?.role || "")
        .trim()
        .toLowerCase();

      if (nextRole !== "admin" && nextRole !== "editor") {
        return json({ message: "Role hanya boleh admin atau editor." }, 400);
      }

      if (currentUserId && currentUserId === userId) {
        return json(
          { message: "Tidak bisa mengubah role akun Anda sendiri." },
          400,
        );
      }

      const { data: targetProfile, error: targetProfileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("id", userId)
        .maybeSingle();

      if (targetProfileError) throw targetProfileError;

      const targetEmail = String(targetProfile?.email || "")
        .trim()
        .toLowerCase();

      if (targetEmail && targetEmail === SUPER_ADMIN_EMAIL) {
        return json(
          { message: "Role akun super admin dikunci dan tidak dapat diubah." },
          403,
        );
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: nextRole,
          updated_at: now,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { error: adminUserError } = await supabase
        .from("admin_users")
        .update({
          role: nextRole,
          updated_at: now,
        })
        .eq("user_id", userId);

      if (adminUserError) throw adminUserError;

      return json({
        message: `Role akun berhasil diubah menjadi ${nextRole}.`,
      });
    }

    if (action === "delete") {
      if (currentUserId && currentUserId === userId) {
        return json(
          { message: "Tidak bisa menghapus akun Anda sendiri." },
          400,
        );
      }

      const { data: targetProfile, error: targetProfileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("id", userId)
        .maybeSingle();

      if (targetProfileError) throw targetProfileError;

      const targetEmail = String(targetProfile?.email || "")
        .trim()
        .toLowerCase();

      if (targetEmail && targetEmail === SUPER_ADMIN_EMAIL) {
        return json({ message: "Akun super admin tidak dapat dihapus." }, 403);
      }

      const { error: permissionsError } = await supabase
        .from("user_permissions")
        .delete()
        .eq("user_id", userId);

      if (permissionsError) throw permissionsError;

      const { error: requestDeleteError } = await supabase
        .from("editor_requests")
        .delete()
        .eq("user_id", userId);

      if (requestDeleteError) throw requestDeleteError;

      const { error: adminDeleteError } = await supabase
        .from("admin_users")
        .delete()
        .eq("user_id", userId);

      if (adminDeleteError) throw adminDeleteError;

      const { error: profileDeleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileDeleteError) throw profileDeleteError;

      return json({ message: "Akun editor berhasil dihapus." });
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
