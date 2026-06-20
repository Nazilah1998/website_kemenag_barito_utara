import { redis, hasRedis } from "./redis";

interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter?: number;
}

interface MemoryBucket {
  startedAt: number;
  count: number;
  windowMs: number;
}

interface SessionLike {
  profile?: { id?: string };
  user?: { id?: string };
}

interface RequestLike {
  headers?: {
    get?: (name: string) => string | null;
  };
}

const memoryBuckets = new Map<string, MemoryBucket>();
const MEMORY_CLEANUP_INTERVAL = 60_000;

async function localRedisRateLimit({ key, limit, windowMs }: { key: string; limit: number; windowMs: number }): Promise<RateLimitResult> {
  if (!redis) return { ok: true, remaining: limit - 1 };

  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  
  try {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, windowSec);
    }

    if (count > limit) {
      const ttl = await redis.ttl(key);
      const retryAfter = ttl > 0 ? ttl : windowSec;

      return {
        ok: false,
        remaining: 0,
        retryAfter,
      };
    }

    return {
      ok: true,
      remaining: Math.max(0, limit - count),
    };
  } catch (error) {
    // Fallback if redis fails
    return { ok: true, remaining: limit - 1 };
  }
}

let cleanupTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleMemoryCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setTimeout(() => {
    cleanupTimer = null;
    const now = Date.now();
    for (const [key, bucket] of memoryBuckets) {
      if (now - bucket.startedAt > Math.max(bucket.windowMs || 60_000, 60_000)) {
        memoryBuckets.delete(key);
      }
    }
    if (memoryBuckets.size > 0) scheduleMemoryCleanup();
  }, MEMORY_CLEANUP_INTERVAL);
}

function memoryRateLimit({ key, limit, windowMs }: { key: string; limit: number; windowMs: number }): RateLimitResult {
  const now = Date.now();
  const current = memoryBuckets.get(key);

  if (!current || now - current.startedAt > windowMs) {
    // Prevent memory leaks: max 5000 IPs tracked in memory if Redis is down
    if (memoryBuckets.size > 5000) {
      // Clear oldest entries (maps iterate in insertion order)
      let count = 0;
      for (const [k] of memoryBuckets) {
        memoryBuckets.delete(k);
        if (++count > 1000) break;
      }
    }
    
    memoryBuckets.set(key, {
      startedAt: now,
      count: 1,
      windowMs,
    });

    scheduleMemoryCleanup();

    return {
      ok: true,
      remaining: Math.max(0, limit - 1),
    };
  }

  if (current.count >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - current.startedAt)) / 1000);

    return {
      ok: false,
      remaining: 0,
      retryAfter,
    };
  }

  current.count += 1;

  return {
    ok: true,
    remaining: Math.max(0, limit - current.count),
  };
}

export async function rateLimit({ key, limit = 10, windowMs = 60_000 }: { key: string; limit?: number; windowMs?: number }): Promise<RateLimitResult> {
  const safeKey = `rl:${String(key || "anon")}`;

  if (hasRedis()) {
    return localRedisRateLimit({
      key: safeKey,
      limit,
      windowMs,
    });
  }

  return memoryRateLimit({
    key: safeKey,
    limit,
    windowMs,
  });
}

export function getClientIp(request: RequestLike): string {
  const forwarded = request.headers?.get?.("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return request.headers?.get?.("x-real-ip") || "unknown";
}

export async function rateLimitForAdmin({ key, limit = 30, windowMs = 60_000, session = null }: { key: string; limit?: number; windowMs?: number; session?: SessionLike | null }): Promise<RateLimitResult> {
  const userId = session?.profile?.id || session?.user?.id || "anon";
  return rateLimit({ key: `admin:${userId}:${key}`, limit, windowMs });
}
