import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import EditorsManagementClient from "@/components/features/admin/EditorsManagementClient";

export const dynamic = "force-dynamic";

async function getEditors() {
    const requests = await prisma.editor_requests.findMany({
        include: {
            profiles_editor_requests_user_idToprofiles: {
                select: {
                    id: true,
                    role: true,
                    is_active: true,
                    failed_login_attempts: true,
                    lockout_until: true,
                }
            }
        },
        orderBy: { requested_at: 'desc' }
    });

    if (!requests?.length) {
        return [];
    }

    const userIds = requests.map((item) => item.user_id).filter(Boolean);

    const permissionRows = await prisma.user_permissions.findMany({
        where: { user_id: { in: userIds } },
        select: { user_id: true, permission: true }
    });

    const permissionMap = new Map();

    for (const row of permissionRows || []) {
        const current = permissionMap.get(row.user_id) || [];
        current.push(row.permission);
        permissionMap.set(row.user_id, current);
    }

    return requests.map((item) => {
        const profile = item.profiles_editor_requests_user_idToprofiles;
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