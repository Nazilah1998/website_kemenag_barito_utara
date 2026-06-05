import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  (REDIS_URL ? new Redis(REDIS_URL) : null);

if (process.env.NODE_ENV !== "production" && redis) {
  globalForRedis.redis = redis;
}

export function hasRedis(): boolean {
  return Boolean(redis);
}
