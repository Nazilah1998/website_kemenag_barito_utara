import prisma from "./src/lib/prisma.js";

async function main() {
  const latest = await prisma.berita.findFirst({
    orderBy: { published_at: 'desc' }
  });
  console.log(latest.content);
}
main();
