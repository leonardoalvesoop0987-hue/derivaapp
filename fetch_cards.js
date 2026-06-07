const { prisma } = require('./src/lib/db.js') || require('./src/lib/db.ts');

async function main() {
  const cards = await prisma.card.findMany({ include: { category: true } });
  console.log(JSON.stringify(cards, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
