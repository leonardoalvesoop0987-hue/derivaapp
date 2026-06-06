import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  console.log("=== Diagnóstico de Cartas ===");

  let connectionString = process.env.DATABASE_URL || '';
  if (connectionString.startsWith('prisma+postgres://localhost')) {
    connectionString = 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable';
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const allDecks = await prisma.deck.findMany({
    include: { _count: { select: { cards: true } } }
  });

  console.log("\n1. Decks encontrados:");
  allDecks.forEach(d => {
    console.log(`- ${d.name} (ID: ${d.id}): ${d._count.cards} cartas, unlock: ${d.unlock_group_key}`);
  });

  const allCards = await prisma.card.findMany();
  console.log(`\n2. Total de cartas: ${allCards.length}`);

  console.log("\n3. Cartas Preto vs Tons Mais Escuros:");
  const pretoDeck = allDecks.find(d => d.name === "Preto" || d.name === "Preto Comum");
  const darkDeck = allDecks.find(d => d.name === "Tons mais escuros" || d.unlock_group_key === "DARK_THIRD_IMAGINATION");

  if (pretoDeck) {
    const pretoCards = await prisma.card.findMany({ where: { deck_id: pretoDeck.id } });
    console.log(`\nCartas no deck Preto (${pretoCards.length}):`);
    pretoCards.forEach(c => console.log(`  [${c.id}] ${c.title} (Cat: ${c.category})`));
  } else {
    console.log("\nDeck Preto não encontrado pelo nome.");
  }

  if (darkDeck) {
    const darkCards = await prisma.card.findMany({ where: { deck_id: darkDeck.id } });
    console.log(`\nCartas no deck Tons mais escuros (${darkCards.length}):`);
    darkCards.forEach(c => console.log(`  [${c.id}] ${c.title} (Cat: ${c.category})`));
  } else {
    console.log("\nDeck Tons mais escuros não encontrado pelo nome.");
  }

  const keywords = ['terceir', 'presença', 'imaginária', 'imaginário', 'ciúme', 'confissão', 'cuck', 'outra pessoa', 'outro homem', 'outra mulher', 'a três'];
  
  console.log("\n4. Possíveis cartas com terceiros no título ou corpo:");
  const suspects = allCards.filter(c => {
    const text = ((c.title || '') + ' ' + (c.body || '')).toLowerCase();
    return keywords.some(k => text.includes(k));
  });

  suspects.forEach(c => {
    console.log(`  - [${c.id}] ${c.title}`);
    console.log(`    Deck ID: ${c.deck_id}, Category: ${c.category}, Unlock: ${c.unlock_group_key}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
