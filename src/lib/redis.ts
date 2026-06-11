import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

const globalForRedis = global as unknown as { redis: Redis | null };

// Singleton: selalu simpan koneksi di global agar tidak buat koneksi baru
// di setiap request (penting di production Next.js standalone)
if (!globalForRedis.redis) {
  globalForRedis.redis = REDIS_URL ? new Redis(REDIS_URL) : null;
}

export const redis = globalForRedis.redis;

export function hasRedis(): boolean {
  return Boolean(redis);
}
