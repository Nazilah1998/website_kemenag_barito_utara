import MaintenanceToggle from "@/components/features/admin/maintenance/MaintenanceToggle";
import { db } from "@/lib/drizzle";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

async function getMaintenanceStatus() {
  try {
    const [row] = await db
      .select({ value: schema.siteSettings.value })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "maintenance_mode"))
      .limit(1);
    return row?.value || { active: false, message: "", title: "", updatedBy: null, updatedAt: null };
  } catch {
    return { active: false, message: "", title: "", updatedBy: null, updatedAt: null };
  }
}

export default async function MaintenancePage() {
  const status = await getMaintenanceStatus();

  return (
    <div className="min-w-0">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
          <ShieldAlert className="h-7 w-7 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Mode Maintenance
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Aktifkan atau nonaktifkan mode maintenance seluruh situs dengan satu klik
          </p>
        </div>
      </div>

      <MaintenanceToggle initialStatus={status} />
    </div>
  );
}
