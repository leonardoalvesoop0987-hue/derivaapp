import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

config();

let connectionString = process.env.DATABASE_URL || '';

// Patch for local dev
if (connectionString.startsWith('prisma+postgres://localhost')) {
  connectionString = 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable';
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 Iniciando auditoria de cartas...");
  const cards = await prisma.card.findMany({
    where: { is_active: true },
    orderBy: { position: 'asc' }
  });

  console.log(`Encontradas ${cards.length} cartas ativas.\n`);

  let errors = 0;

  for (const card of cards) {
    const missing: string[] = [];
    
    if (!card.stage) missing.push("stage");
    if (!card.primary_tag) missing.push("primary_tag");
    if (!card.erotic_function) missing.push("erotic_function");
    if (!card.progression_role) missing.push("progression_role");

    if (missing.length > 0) {
      errors++;
      console.log(`⚠️ Carta ${card.position} - "${card.title}" (${card.category})`);
      console.log(`   Faltando: ${missing.join(", ")}`);
    }
  }

  console.log("\n==================================");
  if (errors === 0) {
    console.log("✅ Todas as cartas ativas possuem os atributos básicos da nova engine!");
  } else {
    console.log(`❌ Foram encontradas ${errors} cartas com cadastro incompleto.`);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
