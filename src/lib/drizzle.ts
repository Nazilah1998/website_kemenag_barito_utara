import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../db/schema";
import * as relations from "../db/relations";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Cegah unhandled error dari pool yang bisa crash server
pool.on("error", (err) => {
  console.error(JSON.stringify({ event: "db_pool_error", error: err.message }));
});

export const db = drizzle(pool, { schema: { ...schema, ...relations } });
