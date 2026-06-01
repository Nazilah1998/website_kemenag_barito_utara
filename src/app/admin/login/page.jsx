import AdminLoginClient from "@/components/features/admin/AdminLoginClient";
import { redirect } from "next/navigation";
import { getCurrentSessionContext } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  try {
    const session = await getCurrentSessionContext();
    if (session?.isAuthenticated) {
      redirect("/admin");
    }
  } catch {
    // jika gagal, tampilkan login form
  }

  return <AdminLoginClient />;
}