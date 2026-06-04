const { Client } = require('pg');

const client = new Client('postgresql://postgres:f49YacyrwGrHDi5REIirX7w9TMByR4Dx@185.207.107.58:5432/postgres');

client.connect().then(() => {
  return client.query(`
    INSERT INTO storage.buckets (id, name, public) 
    VALUES 
      ('request-documents', 'request-documents', false), 
      ('generated-documents', 'generated-documents', false) 
    ON CONFLICT DO NOTHING;
  `);
}).then(() => {
  console.log('Buckets created successfully!');
  return client.end();
}).catch(console.error);
