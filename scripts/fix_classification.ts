import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const keywords = ['terceir', 'presença', 'imagin', 'ciúme', 'confissão', 'cuck', 'outra pessoa', 'a três', 'terceiro', 'terceira'];
  
  // Encontra cartas que contêm palavras-chave suspeitas e que NÃO exigem desbloqueio do casal ainda.
  const cards = await prisma.card.findMany({
    where: {
      category: 'PRETO',
      requires_couple_unlock: false,
      OR: keywords.flatMap(kw => [
        { title: { contains: kw, mode: 'insensitive' } },
        { body: { contains: kw, mode: 'insensitive' } },
        { session_short_text: { contains: kw, mode: 'insensitive' } }
      ])
    }
  });

  if (cards.length === 0) {
    console.log("Nenhuma carta de PRETO precisando de ajuste para Tons Mais Escuros foi encontrada. (Talvez já tenham sido migradas!)");
  } else {
    console.log(`Encontradas ${cards.length} cartas em PRETO que serão migradas para a lógica de Tons Mais Escuros:`);
    
    for (const c of cards) {
      console.log(`- Atualizando [${c.id}] ${c.title}...`);
      await prisma.card.update({
        where: { id: c.id },
        data: {
          requires_couple_unlock: true,
          unlock_group_key: 'DARK_THIRD_IMAGINATION'
        }
      });
    }
    
    console.log("Todas as cartas atualizadas com sucesso!");
  }

  const darkCards = await prisma.card.count({
    where: {
      requires_couple_unlock: true,
      unlock_group_key: 'DARK_THIRD_IMAGINATION'
    }
  });
  console.log(`\nAtualmente existem ${darkCards} cartas classificadas corretamente como TONS MAIS ESCUROS.`);
}

main()
  .catch(e => {
    console.error("Erro ao executar script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
