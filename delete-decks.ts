import { prisma } from './src/lib/db';

async function main() {
  await prisma.deck.deleteMany();
  console.log('Deleted decks');
}
main();
