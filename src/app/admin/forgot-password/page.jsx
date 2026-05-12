import { Suspense } from "react";
import AdminForgotPasswordClient from "@/components/features/admin/AdminForgotPasswordClient";

export const dynamic = "force-dynamic";

export default function AdminForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-100 dark:bg-slate-950" />}>
            <AdminForgotPasswordClient />
        </Suspense>
    );
}