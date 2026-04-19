import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "").trim(),
  );
}

export async function GET() {
  try {
    const session = await getCurrentSessionContext();

    if (!session?.isAuthenticated) {
      return json({ message: "Unauthorized." }, 401);
    }

    if (session?.role !== "super_admin") {
      return json(
        { message: "Hanya super admin yang dapat mengakses data editor." },
        403,
      );
    }

    const supabase = createAdminClient();

    const { data: requests, error } = await supabase
      .from("editor_requests")
      .select(
        `
        user_id,
        full_name,
        email,
        unit_name,
        status,
        requested_at,
        reviewed_at,
        reviewed_by,
        review_notes,
        profiles:user_id (
          id,
          role,
          is_active
        )
      `,
      )
      .order("requested_at", { ascending: false });

    if (error) {
      throw error;
    }

    const userIds = (requests || []).map((item) => item.user_id);

    let permissionsMap = new Map();

    if (userIds.length) {
      const { data: rows, error: permissionsError } = await supabase
        .from("user_permissions")
        .select("user_id, permission")
        .in("user_id", userIds);

      if (permissionsError) {
        throw permissionsError;
      }

      permissionsMap = new Map();

      for (const row of rows || []) {
        const current = permissionsMap.get(row.user_id) || [];
        current.push(row.permission);
        permissionsMap.set(row.user_id, current);
      }
    }

    const invalidMfaUserIds = {};

    const editors = (requests || []).map((item) => {
      const status = String(item.status || "").toLowerCase();
      const rawSystemRole = String(item.profiles?.role || "").toLowerCase();
      const normalizedRole =
        rawSystemRole === "admin" || rawSystemRole === "editor"
          ? rawSystemRole
          : "editor";

      const userId = String(item.user_id || "").trim();
      const validUuid = isValidUuid(userId);

      if (!validUuid) {
        invalidMfaUserIds[userId || "(kosong)"] =
          "ID auth belum UUID valid. Sinkronkan data editor sebelum setup MFA.";
      }

      return {
        user_id: item.user_id,
        full_name: item.full_name,
        email: item.email,
        unit_name: item.unit_name || "-",
        status: item.status,
        requested_at: item.requested_at,
        reviewed_at: item.reviewed_at,
        reviewed_by: item.reviewed_by,
        review_notes: item.review_notes,
        role: status === "approved" ? "editor" : normalizedRole,
        system_role: rawSystemRole || "editor",
        is_active: Boolean(item.profiles?.is_active),
        permissions: permissionsMap.get(item.user_id) || [],
        mfa_setup_disabled: !validUuid,
        mfa_setup_reason: validUuid
          ? ""
          : "ID auth editor belum sinkron (bukan UUID valid).",
      };
    });

    return json({ editors, invalidMfaUserIds });
  } catch (error) {
    return json(
      { message: error?.message || "Gagal memuat daftar editor." },
      500,
    );
  }
}
