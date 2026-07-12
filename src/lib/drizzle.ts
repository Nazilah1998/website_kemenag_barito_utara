import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../db/schema";
import * as relations from "../db/relations";

const globalForDb = globalThis as unknown as {
  postgresPool: pg.Pool | undefined;
};

const isProd = process.env.NODE_ENV === "production";
const pool = globalForDb.postgresPool ?? new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: isProd ? 20 : 3, // 20 di VPS/Production, 3 di Local Dev agar tidak bocor
  idleTimeoutMillis: isProd ? 30000 : 10000,
  connectionTimeoutMillis: 30000,
  allowExitOnIdle: !isProd,       // Dev: pool exit jika idle (cegah numpuk)
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresPool = pool;
}

// Cegah unhandled error dari pool yang bisa crash server
pool.on("error", (err) => {
  console.error(JSON.stringify({ event: "db_pool_error", error: err.message }));
});

export const db = drizzle(pool, { schema: { ...schema, ...relations } });
