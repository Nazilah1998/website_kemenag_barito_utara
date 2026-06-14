import { Suspense } from "react";
import AdminUpdatePasswordClient from "@/components/features/admin/AdminUpdatePasswordClient";

export const dynamic = "force-dynamic";

export default function AdminUpdatePasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-100 dark:bg-slate-950" />}>
            <AdminUpdatePasswordClient />
        </Suspense>
    );
}
