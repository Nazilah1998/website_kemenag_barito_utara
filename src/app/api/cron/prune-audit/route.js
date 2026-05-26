import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { admin_audit_log } from "@/db/schema";
import { lt, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const RETENTION_DAYS = 90;

function isAuthorized(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const header = request.headers.get("authorization") || "";
  if (header === `Bearer ${expected}`) return true;

  const { searchParams } = new URL(request.url);
  return searchParams.get("key") === expected;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { message: "Unauthorized.", code: "CRON_UNAUTHORIZED" },
      { status: 401 },
    );
  }

  try {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const result = await db
      .delete(admin_audit_log)
      .where(lt(admin_audit_log.created_at, cutoff));

    return NextResponse.json({
      message: "OK",
      deleted: result.count || 0,
      retentionDays: RETENTION_DAYS,
      cutoffDate: cutoff.toISOString(),
      ranAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal menjalankan cron prune audit." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  return GET(request);
}
