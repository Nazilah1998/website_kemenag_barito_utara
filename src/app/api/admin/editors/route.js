import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { db } from "@/lib/drizzle";
import { editor_requests, profiles, user_permissions } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "").trim(),
  );
}

export async function GET(request) {
  try {
    const auth = await validateAdmin();
    if (!auth.ok) return auth.response;

    if (auth.session?.role !== "super_admin") {
      return apiResponse(
        { message: "Hanya super admin yang dapat mengakses data editor." },
        403,
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const skip = (page - 1) * limit;

    const [requests, [{ count: total }]] = await Promise.all([
      db.query.editor_requests.findMany({
        with: {
          profile_user_id: {
            columns: {
              id: true,
              role: true,
              is_active: true,
            },
            with: {
              user_permissions: {
                columns: {
                  permission: true
                }
              }
            }
          }
        },
        orderBy: [desc(editor_requests.requested_at)],
        offset: skip,
        limit: limit,
      }),
      db.select({ count: sql`count(*)` }).from(editor_requests)
    ]);

    const invalidMfaUserIds = {};

    const editors = requests.map((item) => {
      const profile = item.profile_user_id;
      const status = String(item.status || "").toLowerCase();
      const rawSystemRole = String(profile?.role || "").toLowerCase();
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

      // Map permissions from the relation
      const permissions = (profile?.user_permissions || []).map(p => p.permission);

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
        role:
          item.status === "approved"
            ? profile?.role || "editor"
            : "editor",
        is_active: Boolean(profile?.is_active),
        permissions: permissions,
        mfa_setup_disabled: !validUuid,
        mfa_setup_reason: validUuid
          ? ""
          : "ID auth editor belum sinkron (bukan UUID valid).",
      };
    });

    return apiResponse({
      editors,
      invalidMfaUserIds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET Editors Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal memuat daftar editor." },
      500,
    );
  }
}
