const prisma = require('../src/lib/prisma').default;

async function check() {
  try {
    const profile = await prisma.profiles.findFirst();
    if (!profile) {
      console.log("No profiles found to check columns.");
      // We can still check raw SQL
    } else {
      console.log("Detected columns in 'profiles':", Object.keys(profile));
    }
    
    // Test direct query
    const raw = await prisma.$queryRawUnsafe(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
    `);
    console.log("All columns in 'profiles' (Raw SQL):", raw.map(r => r.column_name));
  } catch (err) {
    console.error("Diagnostic error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
