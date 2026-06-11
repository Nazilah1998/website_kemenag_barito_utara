import { redis, hasRedis } from "./redis";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// ─── Konvensi Redis key ─────────────────────────────────────────────────────
// "views:{slug}" → delta views PENDING yang belum di-flush ke DB.
// Key dihapus secara atomik saat flush. Nilai selalu delta, bukan total,
// sehingga restart Redis/server TIDAK pernah merusak data DB.
// ───────────────────────────────────────────────────────────────────────────

// Lua script: ambil nilai & hapus key secara atomik dalam 1 roundtrip.
// Mencegah race condition antara flushViews dan incrementView.
const LUA_GETDEL = `
local val = redis.call('GET', KEYS[1])
if val then redis.call('DEL', KEYS[1]) end
return val
`;

let flushTimer: ReturnType<typeof setTimeout> | null = null;
let isFlushRunning = false;
const FLUSH_INTERVAL = 30_000; // 30 detik

async function flushViews(): Promise<void> {
  if (!hasRedis() || !redis || isFlushRunning) return;
  isFlushRunning = true;

  try {
    const keys = await redis.keys("views:*");
    if (!keys || keys.length === 0) return;

    await Promise.all(
      keys.map(async (key: string) => {
        const slug = key.replace("views:", "");

        // Atomik: ambil delta dan hapus key dalam 1 operasi (cegah race condition)
        let delta: number;
        try {
          const val = await (redis as any).eval(LUA_GETDEL, 1, key);
          delta = Number(val);
        } catch {
          // Fallback jika Lua tidak tersedia (Redis versi lama)
          const val = await redis!.get(key);
          if (val !== null) await redis!.del(key);
          delta = Number(val);
        }

        if (!delta || isNaN(delta) || delta <= 0) return;

        // Increment DB dengan delta — aman dari double-count
        await db
          .update(berita)
          .set({ views: sql`${berita.views} + ${delta}` })
          .where(eq(berita.slug, slug))
          .catch((err: Error) => {
            // Jika DB gagal, kembalikan delta ke Redis agar tidak hilang
            redis!.incrby(key, delta).catch(() => {});
            console.error(JSON.stringify({ event: "view_flush_error", slug, delta, error: err.message }));
          });
      }),
    );
  } catch (error: any) {
    console.error(JSON.stringify({ event: "view_flush_error", error: error?.message }));
  } finally {
    isFlushRunning = false;
  }
}

async function scheduleFlush(): Promise<void> {
  // Jangan jadwalkan ulang jika sudah ada timer berjalan
  if (flushTimer) return;

  flushTimer = setTimeout(async () => {
    flushTimer = null;
    await flushViews();

    // Hanya jadwalkan ulang jika masih ada pending views di Redis
    // — mencegah timer berjalan selamanya saat tidak ada traffic
    if (hasRedis() && redis) {
      try {
        const pendingKeys = await redis.keys("views:*");
        if (pendingKeys && pendingKeys.length > 0) {
          scheduleFlush();
        }
      } catch {
        // Jika gagal check, jangan re-schedule — akan dijadwalkan lagi
        // oleh incrementView saat ada view baru masuk
      }
    }
  }, FLUSH_INTERVAL);
}

export async function incrementView(slug: string): Promise<number> {
  // ── Path 1: Redis tersedia — delta buffering, flush berkala ───────────────
  if (hasRedis() && redis) {
    try {
      const pending = await redis.incr(`views:${slug}`);
      scheduleFlush(); // jadwalkan flush — akan stop sendiri jika tidak ada traffic

      if (typeof pending === "number") {
        // Tampilkan estimasi total (DB + pending) ke user
        const result = await db
          .select({ views: berita.views })
          .from(berita)
          .where(eq(berita.slug, slug))
          .limit(1);
        const dbViews = Number(result[0]?.views ?? 0);
        return dbViews + pending;
      }
    } catch {
      // Redis gagal → fallback ke DB langsung
    }
  }

  // ── Path 2: Tanpa Redis — increment langsung ke DB ────────────────────────
  try {
    const result = await db
      .update(berita)
      .set({ views: sql`${berita.views} + 1` })
      .where(eq(berita.slug, slug))
      .returning({ views: berita.views });

    return Number(result[0]?.views ?? 0);
  } catch (error: any) {
    console.error(JSON.stringify({ event: "view_counter_error", slug, error: error?.message }));
    return 0;
  }
}


