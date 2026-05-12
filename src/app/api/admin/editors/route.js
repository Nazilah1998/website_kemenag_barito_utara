import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "").trim(),
  );
}

export async function GET() {
  try {
    const auth = await validateAdmin();
    if (!auth.ok) return auth.response;

    if (auth.session?.role !== "super_admin") {
      return apiResponse(
        { message: "Hanya super admin yang dapat mengakses data editor." },
        403,
      );
    }

    const requests = await prisma.editor_requests.findMany({
      include: {
        profiles_editor_requests_user_idToprofiles: {
          select: {
            id: true,
            role: true,
            is_active: true,
            user_permissions: {
              select: {
                permission: true
              }
            }
          }
        }
      },
      orderBy: { requested_at: 'desc' }
    });

    const invalidMfaUserIds = {};

    const editors = requests.map((item) => {
      const profile = item.profiles_editor_requests_user_idToprofiles;
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
        role: status === "approved" ? "editor" : normalizedRole,
        system_role: rawSystemRole || "editor",
        is_active: Boolean(profile?.is_active),
        permissions: permissions,
        mfa_setup_disabled: !validUuid,
        mfa_setup_reason: validUuid
          ? ""
          : "ID auth editor belum sinkron (bukan UUID valid).",
      };
    });

    return apiResponse({ editors, invalidMfaUserIds });
  } catch (error) {
    console.error("GET Editors Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal memuat daftar editor." },
      500,
    );
  }
}
