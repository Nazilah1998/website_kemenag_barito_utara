import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool);
  
  const result = await db.execute(`SELECT * FROM profiles WHERE email = 'baritoutara@kemenag.go.id'`);
  console.log('Profiles with baritoutara@kemenag.go.id:', result.rows);
  
  const result2 = await db.execute(`SELECT * FROM profiles WHERE email = 'nazilahdeveloper@gmail.com'`);
  console.log('Profiles with nazilahdeveloper@gmail.com:', result2.rows);

  process.exit(0);
}

run().catch(console.error);
