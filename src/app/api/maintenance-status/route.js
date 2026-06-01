import { db } from "@/lib/drizzle";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [row] = await db
      .select({ value: schema.siteSettings.value })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "maintenance_mode"))
      .limit(1);

    const data = row?.value || { active: false };

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "CDN-Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { active: false },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, must-revalidate" },
      },
    );
  }
}
