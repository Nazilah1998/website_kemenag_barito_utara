import { db } from "@/lib/drizzle";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { redis, hasRedis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Coba baca dari Redis (ioredis) untuk akses super cepat
    if (hasRedis() && redis) {
      try {
        const cached = await redis.get("maintenance:mode");
        if (cached) {
          const data = JSON.parse(cached);
          return NextResponse.json(data, {
            status: 200,
            headers: {
              "Cache-Control": "no-store, must-revalidate",
              "CDN-Cache-Control": "no-store",
            },
          });
        }
      } catch (e) {
        // Abaikan error redis, lanjut ke database
      }
    }

    // 2. Jika tidak ada di Redis, ambil dari Database
    const [row] = await db
      .select({ value: schema.siteSettings.value })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "maintenance_mode"))
      .limit(1);

    const data = row?.value || { active: false };

    // 3. Simpan ke Redis agar request selanjutnya cepat
    if (hasRedis() && redis) {
      try {
        await redis.set("maintenance:mode", JSON.stringify(data));
      } catch (e) {
        // Abaikan
      }
    }

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
