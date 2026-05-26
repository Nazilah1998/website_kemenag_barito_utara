import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import EditorsManagementClient from "@/components/features/admin/EditorsManagementClient";
import { db } from "@/lib/drizzle";
import { editor_requests, user_permissions, profiles } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getEditors() {
    const requests = await db.query.editor_requests.findMany({
        with: {
            profile_user_id: {
                columns: {
                    id: true,
                    role: true,
                    is_active: true,
                    failed_login_attempts: true,
                    lockout_until: true,
                    full_name: true,
                    email: true,
                    avatar_url: true,
                }
            }
        },
        orderBy: [desc(editor_requests.requested_at)]
    });

    if (!requests?.length) {
        return [];
    }

    const userIds = requests.map((item) => item.user_id).filter(Boolean);

    const permissionRows = await db
        .select({ user_id: user_permissions.user_id, permission: user_permissions.permission })
        .from(user_permissions)
        .where(inArray(user_permissions.user_id, userIds));

    const permissionMap = new Map();

    for (const row of permissionRows || []) {
        const current = permissionMap.get(row.user_id) || [];
        current.push(row.permission);
        permissionMap.set(row.user_id, current);
    }

    return requests.map((item) => {
        const profile = item.profile_user_id;
        return {
            user_id: item.user_id,
            full_name: profile?.full_name || item.full_name,
            email: profile?.email || item.email,
            avatar_url: profile?.avatar_url || null,
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
            failed_attempts: profile?.failed_login_attempts || 0,
            lockout_until: profile?.lockout_until || null,
            permissions: permissionMap.get(item.user_id) || [],
        };
    });
}

export default async function AdminEditorsPage() {
    const session = await requireAdmin({
        loginRedirect: "/admin/login",
        forbiddenRedirect:
            "/error?message=" +
            encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
    });

    if (session.role !== "super_admin") {
        redirect(
            "/error?message=" +
            encodeURIComponent("Hanya super admin yang dapat mengakses manajemen editor."),
        );
    }

    const editors = await getEditors();

    return <EditorsManagementClient initialEditors={editors} />;
}