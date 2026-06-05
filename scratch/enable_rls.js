const { Client } = require('pg');
const client = new Client('postgresql://postgres:f49YacyrwGrHDi5REIirX7w9TMByR4Dx@185.207.107.58:5432/postgres');

client.connect().then(async () => {
  try {
    const res = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    let count = 0;
    for (const row of res.rows) {
      const table = row.tablename;
      console.log(`Enabling RLS on: ${table}`);
      await client.query(`ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY;`);
      count++;
    }
    
    console.log(`\nSuccess! Enabled RLS on ${count} tables.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
});
