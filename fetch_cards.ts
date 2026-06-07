import { prisma } from './src/lib/db';

async function main() {
  const cards = await prisma.card.findMany();
  console.log(JSON.stringify(cards, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
