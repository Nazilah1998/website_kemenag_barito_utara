const { Client } = require('pg');

const client = new Client('postgresql://postgres:f49YacyrwGrHDi5REIirX7w9TMByR4Dx@185.207.107.58:5432/postgres');

client.connect().then(() => {
  const query = `
    INSERT INTO auth.identities (
      id,
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    )
    SELECT 
      gen_random_uuid(),
      id::text,
      id,
      jsonb_build_object(
        'sub', id::text,
        'email', email,
        'email_verified', false,
        'phone_verified', false
      ),
      'email',
      last_sign_in_at,
      created_at,
      updated_at
    FROM auth.users
    WHERE id NOT IN (SELECT user_id FROM auth.identities)
    AND email IS NOT NULL;
  `;
  return client.query(query);
}).then((res) => {
  console.log(`Successfully inserted ${res.rowCount} missing identities!`);
  return client.end();
}).catch(console.error);
