const { Client } = require('pg');
const client = new Client('postgresql://postgres:f49YacyrwGrHDi5REIirX7w9TMByR4Dx@185.207.107.58:5432/postgres');
client.connect().then(() => {
  return client.query(`
    SELECT relname, relrowsecurity 
    FROM pg_class 
    WHERE relname LIKE 'ptsp_%' AND relkind = 'r'
  `);
}).then(res => {
  console.table(res.rows);
  return client.end();
}).catch(console.error);
