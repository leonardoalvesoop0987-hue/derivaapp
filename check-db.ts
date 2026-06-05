import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function main() {
  const darkGroup = await prisma.unlockGroup.findUnique({
    where: { key: 'DARK_THIRD_IMAGINATION' }
  });
  console.log('Dark Group:', darkGroup?.key);

  const darkCards = await prisma.card.findMany({
    where: { unlock_group_key: 'DARK_THIRD_IMAGINATION' }
  });
  console.log('Dark cards count:', darkCards.length);

  const allCards = await prisma.card.count();
  console.log('Total cards:', allCards);
  
  const allDecks = await prisma.deck.findMany();
  console.log('Decks:', allDecks.map(d => d.name));
}

main().finally(() => prisma.$disconnect());
