const { Client } = require('pg');

const oldDbUrl = "postgresql://postgres.ruunarawpewddmxexddl:%40Nazilah200998@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres";
const newDbUrl = "postgresql://postgres:f49YacyrwGrHDi5REIirX7w9TMByR4Dx@185.207.107.58:5432/postgres";

const oldClient = new Client(oldDbUrl);
const newClient = new Client(newDbUrl);

async function migrate() {
  await oldClient.connect();
  await newClient.connect();
  
  console.log("Connected to both databases.");

  // 1. Fetch users from Kemenag (new DB)
  const newUsersRes = await newClient.query('SELECT id, email FROM auth.users');
  const kemenagUsersByEmail = {};
  newUsersRes.rows.forEach(u => kemenagUsersByEmail[u.email] = u.id);

  // 2. Fetch users from PTSP (old DB)
  const oldUsersRes = await oldClient.query('SELECT * FROM auth.users');
  const idMap = {}; // old_id -> new_id
  
  for (const oldUser of oldUsersRes.rows) {
    if (kemenagUsersByEmail[oldUser.email]) {
      idMap[oldUser.id] = kemenagUsersByEmail[oldUser.email];
      console.log(`User ${oldUser.email} exists, mapping ID ${oldUser.id} -> ${idMap[oldUser.id]}`);
    } else {
      idMap[oldUser.id] = oldUser.id; // Keep same ID
      console.log(`User ${oldUser.email} does not exist, inserting...`);
      // Insert into auth.users (simplest way, include essential columns)
      const cols = Object.keys(oldUser).filter(k => oldUser[k] !== null && k !== 'confirmed_at');
      const vals = cols.map(k => typeof oldUser[k] === 'object' && oldUser[k] !== null && !(oldUser[k] instanceof Date) ? JSON.stringify(oldUser[k]) : oldUser[k]);
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      
      const query = `INSERT INTO auth.users (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;
      try {
        await newClient.query(query, vals);
      } catch(e) {
        console.error(`Failed to insert user ${oldUser.email}:`, e.message);
      }
    }
  }

  const mapId = (id) => id && idMap[id] ? idMap[id] : id;

  const tables = [
    { old: 'profiles', new: 'ptsp_profiles', userCols: ['id'] }, // ptsp_profiles pk is id
    { old: 'role_permissions', new: 'ptsp_role_permissions', userCols: [] },
    { old: 'services', new: 'ptsp_services', userCols: [] },
    { old: 'service_items', new: 'ptsp_service_items', userCols: [] },
    { old: 'service_form_fields', new: 'ptsp_service_form_fields', userCols: [] },
    { old: 'service_requirements', new: 'ptsp_service_requirements', userCols: [] },
    { old: 'service_requests', new: 'ptsp_service_requests', userCols: ['user_id'] },
    { old: 'service_request_answers', new: 'ptsp_service_request_answers', userCols: [] },
    { old: 'service_request_documents', new: 'ptsp_service_request_documents', userCols: [] },
    { old: 'service_request_reviews', new: 'ptsp_service_request_reviews', userCols: ['reviewer_id'] },
    { old: 'generated_documents', new: 'ptsp_generated_documents', userCols: ['generated_by'] },
    { old: 'activity_logs', new: 'ptsp_activity_logs', userCols: ['actor_id'] },
    { old: 'audit_logs', new: 'ptsp_audit_logs', userCols: ['admin_id'] },
    { old: 'notifications', new: 'ptsp_notifications', userCols: ['user_id'] },
    { old: 'guest_book', new: 'ptsp_guest_book', userCols: [] },
    { old: 'appointments', new: 'ptsp_appointments', userCols: [] },
    { old: 'feedbacks', new: 'ptsp_feedbacks', userCols: [] },
    { old: 'system_status', new: 'ptsp_system_status', userCols: ['maintenance_started_by'] }
  ];

  for (const table of tables) {
    console.log(`Migrating ${table.old} -> ${table.new}...`);
    try {
      const res = await oldClient.query(`SELECT * FROM ${table.old}`);
      let inserted = 0;
      for (let row of res.rows) {
        // Map user IDs
        for (const uCol of table.userCols) {
          if (row[uCol]) row[uCol] = mapId(row[uCol]);
        }
        
        // Remove identity columns if id is generated (for bigint/serial)
        // Actually, we want to preserve IDs. So we must OVERRIDE identity.
        // Postgres: INSERT INTO ... OVERRIDING SYSTEM VALUE
        
        const cols = Object.keys(row).filter(k => row[k] !== null);
        const vals = cols.map(k => typeof row[k] === 'object' && row[k] !== null && !(row[k] instanceof Date) ? JSON.stringify(row[k]) : row[k]);
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
        
        // Check if table has identity column (mostly bigint)
        let overriding = '';
        if (cols.includes('id') && table.old !== 'profiles' && table.old !== 'service_requests' && table.old !== 'notifications' && table.old !== 'system_status' && table.old !== 'role_permissions') {
            overriding = 'OVERRIDING SYSTEM VALUE ';
        }

        const insertQuery = `INSERT INTO ${table.new} (${cols.map(c => `"${c}"`).join(', ')}) ${overriding}VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
        
        try {
          await newClient.query(insertQuery, vals);
          inserted++;
        } catch (err) {
          console.error(`Error inserting row into ${table.new}:`, err.message, row);
        }
      }
      
      // Update sequence for tables with identity
      if (inserted > 0 && table.old !== 'profiles' && table.old !== 'service_requests' && table.old !== 'notifications' && table.old !== 'system_status' && table.old !== 'role_permissions') {
          try {
              await newClient.query(`SELECT setval(pg_get_serial_sequence('${table.new}', 'id'), coalesce(max(id),0) + 1, false) FROM ${table.new}`);
          } catch(seqErr) {
              console.log(`Could not update sequence for ${table.new}:`, seqErr.message);
          }
      }
      
      console.log(`Inserted ${inserted}/${res.rows.length} rows into ${table.new}.`);
    } catch(e) {
      console.error(`Failed to migrate ${table.old}:`, e.message);
    }
  }

  // Handle Supabase auth.identities
  console.log("Migrating auth.identities for migrated users...");
  const oldIdentitiesRes = await oldClient.query('SELECT * FROM auth.identities');
  for (const oldIdent of oldIdentitiesRes.rows) {
    if (idMap[oldIdent.user_id] && idMap[oldIdent.user_id] === oldIdent.user_id) {
        // Insert missing identities
        const cols = Object.keys(oldIdent).filter(k => oldIdent[k] !== null);
        const vals = cols.map(k => typeof oldIdent[k] === 'object' && oldIdent[k] !== null && !(oldIdent[k] instanceof Date) ? JSON.stringify(oldIdent[k]) : oldIdent[k]);
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO auth.identities (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
        try {
          await newClient.query(query, vals);
        } catch(e) {}
    }
  }

  console.log("Migration complete.");
  await oldClient.end();
  await newClient.end();
}

migrate().catch(console.error);
