const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    return;
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const berita = await prisma.berita.findMany({ take: 1 });
    console.log('Success! Berita found:', berita.length);
  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
