import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

import { PERMISSIONS } from "@/lib/permissions";

const ALLOWED_PERMISSIONS = new Set(Object.values(PERMISSIONS));

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request, context) {
  try {
    const session = await requireAdmin({
      loginRedirect: "/admin/login",
    });

    if (session?.role !== "super_admin") {
      return json(
        { message: "Hanya super admin yang dapat mengatur permission editor." },
        403,
      );
    }

    const params = await context.params;
    const userId = params?.userId;

    if (!userId) {
      return json({ message: "User ID editor tidak valid." }, 400);
    }

    const body = await request.json().catch(() => ({}));
    const permissions = Array.isArray(body?.permissions)
      ? [...new Set(body.permissions.map((item) => String(item).trim()))]
      : [];

    const invalidPermission = permissions.find(
      (item) => !ALLOWED_PERMISSIONS.has(item),
    );

    if (invalidPermission) {
      return json(
        { message: `Permission tidak valid: ${invalidPermission}` },
        400,
      );
    }

    const supabase = createAdminClient();
    const now = new Date().toISOString();

    const { error: deleteError } = await supabase
      .from("user_permissions")
      .delete()
      .eq("user_id", userId);

    if (deleteError) throw deleteError;

    if (permissions.length) {
      const payload = permissions.map((permission) => ({
        user_id: userId,
        permission,
        created_at: now,
        updated_at: now,
      }));

      const { error: insertError } = await supabase
        .from("user_permissions")
        .insert(payload);

      if (insertError) throw insertError;
    }

    return json({ message: "Permission editor berhasil disimpan." });
  } catch (error) {
    return json(
      { message: error?.message || "Gagal menyimpan permission editor." },
      500,
    );
  }
}
