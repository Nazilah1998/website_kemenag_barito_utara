const pg = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    const res = await pool.query('SELECT * FROM profiles LIMIT 1');
    console.log("Success! Columns:", res.fields.map(f => f.name));
  } catch (err) {
    console.error("Query Error:", err);
  } finally {
    await pool.end();
  }
}

run();
