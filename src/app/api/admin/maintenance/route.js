import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateAdmin } from "@/lib/cms-utils";
import { recordAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { broadcastRefresh } from "@/lib/realtime-service";
import { redis, hasRedis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const auth = await validateAdmin({});
  if (!auth.ok) return auth.response;

  if (auth.session.role !== "super_admin") {
    return NextResponse.json(
      { message: "Forbidden. Only super admin can toggle maintenance mode.", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { active, message, title } = body;

    const value = {
      active: Boolean(active),
      title: title || "Pemeliharaan Sistem",
      message: message || "Website sedang dalam perbaikan. Mohon kembali lagi beberapa saat.",
      updatedBy: auth.session.profile?.email || auth.session.user?.email || null,
      updatedAt: new Date().toISOString(),
    };

    await db
      .insert(schema.siteSettings)
      .values({ key: "maintenance_mode", value })
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: { value, updatedAt: new Date().toISOString() },
      });

    // Sync ke Redis lokal (ioredis) agar API baca lebih cepat
    if (hasRedis() && redis) {
      try {
        await redis.set("maintenance:mode", JSON.stringify(value));
      } catch (error) {
        console.warn(`[Warning] Failed to sync maintenance mode to Redis cache: ${error.message}`);
        // Jangan return 500 di sini, biarkan berlanjut agar DB tetap terupdate
      }
    }

    await recordAudit({
      session: auth.session,
      action: active ? "MAINTENANCE_ENABLE" : "MAINTENANCE_DISABLE",
      entity: "site_settings",
      entityId: "maintenance_mode",
      summary: active ? "Super admin mengaktifkan mode maintenance" : "Super admin menonaktifkan mode maintenance",
      after: value,
    });

    revalidatePath("/", "layout");
    await broadcastRefresh("maintenance_mode");

    return NextResponse.json({
      ok: true,
      active: Boolean(active),
      message: active
        ? "Mode maintenance telah diaktifkan. Semua halaman publik akan menampilkan halaman maintenance."
        : "Mode maintenance telah dinonaktifkan. Situs kembali normal.",
    });
  } catch (error) {
    console.error("[Maintenance API Error]:", error);
    return NextResponse.json(
      { message: error.message || "Gagal mengubah mode maintenance." },
      { status: 500 },
    );
  }
}
