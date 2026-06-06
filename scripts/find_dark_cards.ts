import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const keywords = ['terceir', 'presença', 'imagin', 'ciúme', 'confissão', 'cuck', 'outra pessoa', 'a três', 'terceiro', 'terceira'];
  
  const cards = await prisma.card.findMany({
    where: {
      category: 'PRETO',
      OR: keywords.flatMap(kw => [
        { title: { contains: kw, mode: 'insensitive' } },
        { body: { contains: kw, mode: 'insensitive' } },
        { session_short_text: { contains: kw, mode: 'insensitive' } }
      ])
    }
  });

  console.log(`Encontradas ${cards.length} cartas na categoria PRETO que parecem pertencer a TONS MAIS ESCUROS:`);
  cards.forEach(c => {
    console.log(`- [${c.id}] ${c.title}`);
  });

  const darkCards = await prisma.card.findMany({
    where: {
      requires_couple_unlock: true,
      unlock_group_key: 'DARK_THIRD_IMAGINATION'
    }
  });
  console.log(`\nAtualmente existem ${darkCards.length} cartas classificadas corretamente como TONS MAIS ESCUROS.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
