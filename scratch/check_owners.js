const { Client } = require('pg');
const client = new Client('postgresql://postgres:f49YacyrwGrHDi5REIirX7w9TMByR4Dx@185.207.107.58:5432/postgres');

client.connect().then(async () => {
  try {
    const res = await client.query(`
      SELECT tablename, tableowner 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    console.table(res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
});
