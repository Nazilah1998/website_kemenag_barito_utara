const prisma = require('./src/lib/prisma').default || require('./src/lib/prisma');

async function main() {
  const berita = await prisma.berita.findMany({
    orderBy: [
      { published_at: 'desc' },
      { created_at: 'desc' }
    ],
    select: { id: true, title: true, published_at: true, created_at: true },
    take: 10
  });
  console.log(JSON.stringify(berita, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
