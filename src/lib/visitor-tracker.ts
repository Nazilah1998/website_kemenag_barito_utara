import { redis, hasRedis } from "./redis";
import { db } from "@/lib/drizzle";
import { siteSettings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const VISITOR_KEY = "visitor_stats";
const INITIAL_TOTAL = 1860;

const LUA_GETDEL = `
local val = redis.call('GET', KEYS[1])
if val then redis.call('DEL', KEYS[1]) end
return val
`;

function getTodayDateStr() {
  const d = new Date();
  d.setHours(d.getHours() + 7); // WIB timezone adjustment
  return d.toISOString().split("T")[0];
}

export async function getVisitorStats() {
  const todayStr = getTodayDateStr();
  let total = INITIAL_TOTAL;
  let today = 0;

  try {
    // 1. Fetch from DB
    const result = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, VISITOR_KEY))
      .limit(1);

    if (result.length > 0) {
      const data = result[0].value as any;
      total = data?.total ?? INITIAL_TOTAL;
      if (total < INITIAL_TOTAL) total = INITIAL_TOTAL;
      
      // Fallback: If no Redis, use DB's today count
      if (!hasRedis() || !redis) {
        if (data?.todayDate === todayStr) {
          today = data?.todayCount || 0;
        }
      }
    } else {
      // Seed initial data
      await db.insert(siteSettings).values({
        key: VISITOR_KEY,
        value: { total: INITIAL_TOTAL, todayCount: 0, todayDate: todayStr },
      }).catch(() => {}); // Ignore concurrent insert errors
    }

    // 2. Add pending from Redis
    if (hasRedis() && redis) {
      const pendingTotalStr = await redis.get("visitor:total_pending");
      const pendingTotal = Number(pendingTotalStr || 0);

      const todayCountStr = await redis.get(`visitor:today:${todayStr}`);
      today = Number(todayCountStr || 0);

      total += pendingTotal;
    }
  } catch (error) {
    console.error("[visitor-tracker] getVisitorStats error:", error);
  }

  return { total, today };
}

let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 30_000;

async function flushVisitorStats() {
  if (!hasRedis() || !redis) return;

  try {
    let delta = 0;
    try {
      const val = await (redis as any).eval(LUA_GETDEL, 1, "visitor:total_pending");
      delta = Number(val);
    } catch {
      const val = await redis.get("visitor:total_pending");
      if (val !== null) await redis.del("visitor:total_pending");
      delta = Number(val);
    }

    if (!delta || isNaN(delta) || delta <= 0) return;

    const todayStr = getTodayDateStr();
    let redisToday = 0;
    try {
      redisToday = Number(await redis.get(`visitor:today:${todayStr}`) || 0);
    } catch {}

    const result = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, VISITOR_KEY))
      .limit(1);

    let newTotal = INITIAL_TOTAL + delta;
    if (result.length > 0) {
      const currentData = result[0].value as any;
      const dbTotal = Number(currentData?.total || INITIAL_TOTAL);
      newTotal = (dbTotal < INITIAL_TOTAL ? INITIAL_TOTAL : dbTotal) + delta;
      
      // Determine today's count to sync back to DB
      const dbTodayCount = currentData?.todayDate === todayStr ? (currentData?.todayCount || 0) : 0;
      const syncedTodayCount = redisToday > 0 ? redisToday : dbTodayCount + delta; // roughly

      await db
        .update(siteSettings)
        .set({ 
          value: { total: newTotal, todayCount: syncedTodayCount, todayDate: todayStr }, 
          updatedAt: new Date().toISOString() 
        })
        .where(eq(siteSettings.key, VISITOR_KEY));
    } else {
      await db.insert(siteSettings).values({
        key: VISITOR_KEY,
        value: { total: newTotal, todayCount: redisToday || delta, todayDate: todayStr },
      });
    }
  } catch (error) {
    console.error("[visitor-tracker] flushVisitorStats error:", error);
  }
}

export async function incrementVisitorStats() {
  const todayStr = getTodayDateStr();

  if (hasRedis() && redis) {
    try {
      await redis.incr("visitor:total_pending");
      await redis.incr(`visitor:today:${todayStr}`);
      // Expire daily key after 48h to prevent Redis bloat
      await redis.expire(`visitor:today:${todayStr}`, 48 * 3600);

      if (!flushTimer) {
        flushTimer = setTimeout(() => {
          flushTimer = null;
          flushVisitorStats();
        }, FLUSH_INTERVAL);
      }
    } catch (error) {
      console.error("[visitor-tracker] incrementVisitorStats error:", error);
    }
  } else {
    // Fallback if no Redis - use atomic jsonb_set update
    try {
      const result = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, VISITOR_KEY))
        .limit(1);
      
      if (result.length > 0) {
        await db
          .update(siteSettings)
          .set({ 
            value: sql`
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    COALESCE(${siteSettings.value}, '{}'::jsonb),
                    '{total}',
                    (GREATEST(COALESCE((${siteSettings.value}->>'total')::int, ${INITIAL_TOTAL}), ${INITIAL_TOTAL}) + 1)::text::jsonb
                  ),
                  '{todayCount}',
                  (CASE 
                    WHEN ${siteSettings.value}->>'todayDate' = ${todayStr} 
                    THEN COALESCE((${siteSettings.value}->>'todayCount')::int, 0) + 1
                    ELSE 1 
                  END)::text::jsonb
                ),
                '{todayDate}',
                to_jsonb(${todayStr}::text)
              )
            `, 
            updatedAt: new Date().toISOString() 
          })
          .where(eq(siteSettings.key, VISITOR_KEY));
      } else {
        await db.insert(siteSettings).values({
          key: VISITOR_KEY,
          value: { total: INITIAL_TOTAL + 1, todayCount: 1, todayDate: todayStr },
        });
      }
    } catch (error) {
      console.error("[visitor-tracker] incrementVisitorStats fallback error:", error);
    }
  }
}
