import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../db/schema";
import * as relations from "../db/relations";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 7,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema: { ...schema, ...relations } });
