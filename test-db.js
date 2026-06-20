import { db } from "./src/lib/drizzle.js";
import { link_aplikasi_seksi } from "./src/db/schema.js";

async function test() {
  try {
    const res = await db.select().from(link_aplikasi_seksi).limit(1);
    console.log("Success:", res);
  } catch (err) {
    console.error("FULL ERROR OBJECT:", err);
  }
  process.exit(0);
}

test();
