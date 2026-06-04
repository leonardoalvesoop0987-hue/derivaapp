const fs = require('fs');
const path = require('path');

const contextPath = path.join(__dirname, '..', 'Docs', 'CONTEXTO_COMPLETO_DERIVA_PWA.md');
const contextContent = fs.readFileSync(contextPath, 'utf-8');

const seedOutPath = path.join(__dirname, 'prisma', 'seed.ts');

const regex = /### (\d+)\. (.*?)\n\nCategoria: (.*?)\s*\nIntensidade: (.*?)\s*\nInvertível: (.*?)\s*\nRequer vídeo: (.*?)\s*(?:\nReceiver rule: (.*?)\s*)?\n\n([\s\S]*?)(?=\n---\n|\n## |\n# |$)/g;

let match;
const cards = [];
while ((match = regex.exec(contextContent)) !== null) {
  const [_, position, title, category, intensity, invertible, requiresVideo, receiverRule, bodyRaw] = match;
  
  const body = bodyRaw.trim().replace(/"/g, '\\"');
  
  cards.push({
    position: parseInt(position),
    system_key: `deriva-v1-card-${position.padStart(3, '0')}`,
    title: title.trim(),
    category: category.trim(),
    intensity: intensity.trim(),
    is_invertible: invertible.trim() === 'sim',
    requires_video: requiresVideo.trim() === 'sim',
    receiver_rule: receiverRule ? receiverRule.trim() : 'NONE',
    body: body,
  });
}

const seedScript = `import { PrismaClient, CardCategory, CardIntensity, ReceiverRule } from '@prisma/client';

const prisma = new PrismaClient();

const cards = ${JSON.stringify(cards, null, 2)};

async function main() {
  const defaultDeckKey = 'deriva-default-v1';
  
  let deck = await prisma.deck.findUnique({
    where: { system_key: defaultDeckKey }
  });

  if (!deck) {
    deck = await prisma.deck.create({
      data: {
        system_key: defaultDeckKey,
        name: 'Deck Padrão',
        type: 'SYSTEM',
        is_default: true,
      }
    });
  }

  for (const card of cards) {
    await prisma.card.upsert({
      where: { system_key: card.system_key },
      update: {
        title: card.title,
        body: card.body,
        category: card.category as CardCategory,
        intensity: card.intensity as CardIntensity,
        position: card.position,
        is_invertible: card.is_invertible,
        requires_video: card.requires_video,
        receiver_rule: card.receiver_rule as ReceiverRule,
      },
      create: {
        deck_id: deck.id,
        system_key: card.system_key,
        title: card.title,
        body: card.body,
        category: card.category as CardCategory,
        intensity: card.intensity as CardIntensity,
        position: card.position,
        is_invertible: card.is_invertible,
        requires_video: card.requires_video,
        receiver_rule: card.receiver_rule as ReceiverRule,
      }
    });
  }
  
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

fs.writeFileSync(seedOutPath, seedScript, 'utf-8');
console.log(`Generated seed.ts with ${cards.length} cards.`);
