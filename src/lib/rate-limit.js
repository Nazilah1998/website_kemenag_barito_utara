/**
 * Rate limiter hybrid:
 * - Jika UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN tersedia, pakai Upstash via REST.
 * - Kalau tidak, fallback ke in-memory bucket (per proses).
 *
 * API:
 *   await rateLimit({ key, limit, windowMs })
 *     -> { ok: boolean, remaining: number, retryAfter?: number }
 */

const memoryBuckets = new Map();

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function useUpstash() {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}

async function upstashCommand(args) {
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      // hindari caching Next.js
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.result ?? null;
  } catch {
    return null;
  }
}

async function upstashRateLimit({ key, limit, windowMs }) {
  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  // INCR + EXPIRE NX via pipeline
  const count = await upstashCommand(["INCR", key]);

  if (typeof count !== "number") {
    return { ok: true, remaining: limit - 1 };
  }

  if (count === 1) {
    await upstashCommand(["EXPIRE", key, String(windowSec), "NX"]);
  }

  if (count > limit) {
    const ttl = await upstashCommand(["TTL", key]);
    const retryAfter = typeof ttl === "number" && ttl > 0 ? ttl : windowSec;
    return { ok: false, remaining: 0, retryAfter };
  }

  return { ok: true, remaining: Math.max(0, limit - count) };
}

function memoryRateLimit({ key, limit, windowMs }) {
  const now = Date.now();
  const entry = memoryBuckets.get(key);

  if (!entry || now - entry.startedAt > windowMs) {
    memoryBuckets.set(key, { startedAt: now, count: 1 });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - entry.startedAt)) / 1000);
    return { ok: false, remaining: 0, retryAfter };
  }

  entry.count += 1;
  return { ok: true, remaining: Math.max(0, limit - entry.count) };
}

export async function rateLimit({ key, limit = 10, windowMs = 60_000 }) {
  const safeKey = `rl:${String(key || "anon")}`;
  if (useUpstash()) {
    return upstashRateLimit({ key: safeKey, limit, windowMs });
  }
  return memoryRateLimit({ key: safeKey, limit, windowMs });
}

export function getClientIp(request) {
  const forwarded = request.headers?.get?.("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers?.get?.("x-real-ip") || "unknown";
}
