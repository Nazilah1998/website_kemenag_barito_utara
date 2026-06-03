require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    // Set NULL untuk avatar lama yang tidak bisa diakses lagi
    const result = await client.query(
      `UPDATE public.profiles 
       SET avatar_url = NULL 
       WHERE avatar_url LIKE '%tcvwuttdwyufxvkacyal%'
       RETURNING id, avatar_url`
    );
    console.log(`✅ ${result.rowCount} avatar lama dihapus (set NULL).`);
    console.log('   Profil akan tampil dengan avatar inisial nama.');

    // Verifikasi final
    const check = await client.query(
      `SELECT COUNT(*) as cnt FROM public.profiles WHERE avatar_url LIKE '%tcvwuttdwyufxvkacyal%'`
    );
    console.log(`\n✅ Sisa URL lama di profiles: ${check.rows[0].cnt}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
