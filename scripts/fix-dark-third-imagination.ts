import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando script de migração: fix-dark-third-imagination');

  // 1. Obter os Decks
  const darkDeck = await prisma.deck.findUnique({ where: { system_key: 'deriva-dark-v1' } });
  if (!darkDeck) {
    console.log('Deck Tons mais escuros não encontrado! O seed precisa ser rodado antes?');
    process.exit(1);
  }

  const defaultDeck = await prisma.deck.findUnique({ where: { system_key: 'deriva-default-v1' } });
  if (!defaultDeck) {
    console.log('Deck Padrão não encontrado!');
    process.exit(1);
  }

  // 2. Buscar todas as cartas no banco
  const cards = await prisma.card.findMany();

  const keywords = ['terceir', 'presença', 'imaginária', 'imaginário', 'ciúme', 'confissão', 'cuck', 'outra pessoa', 'outro homem', 'outra mulher', 'a três'];

  const updatedCards = [];

  for (const card of cards) {
    const text = ((card.title || '') + ' ' + (card.body || '')).toLowerCase();
    
    // Explicit exceptions that should remain in PRETO based on prompt:
    if (
      card.title === 'Personagens sorteados' || 
      card.title === 'Mistério permitido' || 
      card.title === 'Ordem sussurrada' || 
      card.title === 'Cena de hotel' || 
      card.title === 'Profissional com deslize' || 
      card.title === 'Proibição mental'
    ) {
      continue;
    }

    const matchesKeyword = keywords.some(k => text.includes(k));

    if (matchesKeyword) {
      // É uma carta de terceiros/Tons mais escuros!
      const result = await prisma.card.update({
        where: { id: card.id },
        data: {
          deck_id: darkDeck.id, // Mover para o deck Escuro
          requires_couple_unlock: true,
          unlock_group_key: 'DARK_THIRD_IMAGINATION',
          is_available_in_default: false,
          is_available_in_estreia: false,
        }
      });
      updatedCards.push(result);
      console.log(`[MOVIMENTO] Carta migrada: ${card.title} (ID: ${card.id})`);
    }
  }

  console.log(`\nOperação concluída. ${updatedCards.length} cartas foram movidas para 'Tons mais escuros'.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
