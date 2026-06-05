import { PrismaClient, CardTag } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const cardTags: Record<string, CardTag[]> = {
  "deriva-v1-card-001": ["MASSAGEM", "TOQUE", "FOCO_CASAL"],
  "deriva-v1-card-002": ["TOQUE", "PROVOCACAO", "FOCO_CASAL"],
  "deriva-v1-card-003": ["TOQUE", "BOCA", "FOCO_CASAL"], // Boca -> BEIJO or ORAL
  "deriva-v1-card-004": ["PROIBICAO", "PROVOCACAO", "FOCO_CASAL"],
  "deriva-v1-card-005": ["ROLEPLAY", "MASSAGEM", "TOQUE"],
  "deriva-v1-card-006": ["RESPIRO", "TOQUE", "BEIJO", "OLHAR"],
  "deriva-v1-card-007": ["RESPIRO", "OLHAR", "FALA"],
  "deriva-v1-card-008": ["BEIJO", "TOQUE", "PROVOCACAO"],
  "deriva-v1-card-009": ["FALA", "DIRTY_TALK", "PROVOCACAO"],
  "deriva-v1-card-010": ["PROIBICAO", "CONTROLE_DELE", "CONTROLE_DELA"], // Can be either
  "deriva-v1-card-011": ["RESPIRO", "TOQUE", "FOCO_CASAL"],
  "deriva-v1-card-012": ["PROVOCACAO", "BEIJO", "FALA"],
  "deriva-v1-card-013": ["CONTROLE_DELA", "COMANDO_DELA", "FOCO_NELA", "ORAL", "MAOS"],
  "deriva-v1-card-014": ["CONTROLE_DELA", "COMANDO_DELA", "FOCO_NELA"],
  "deriva-v1-card-015": ["ORAL", "PROVOCACAO", "FOCO_NELA"],
  "deriva-v1-card-016": ["CONTROLE_DELA", "FOCO_NELA"],
  "deriva-v1-card-017": ["FOCO_NELA", "COMANDO_DELA"],
  "deriva-v1-card-018": ["COMANDO_DELA", "CONTROLE_DELA", "FALA"],
  "deriva-v1-card-019": ["COMANDO_DELA", "MAOS", "CONTROLE_DELA"],
  "deriva-v1-card-020": ["COMANDO_DELA", "CONTROLE_DELA", "FOCO_NELA"],
  "deriva-v1-card-021": ["FALA", "DIRTY_TALK", "FOCO_NELA"],
  "deriva-v1-card-022": ["VIDEO", "ORAL", "MAOS", "FOCO_NELA", "PROVOCACAO"],
  "deriva-v1-card-023": ["VIDEO", "ORAL", "MAOS", "FOCO_NELE", "PROVOCACAO"],
  "deriva-v1-card-024": ["ORAL", "MAOS", "FOCO_CASAL"],
  "deriva-v1-card-025": ["VIDEO", "MAOS", "ORAL"],
  "deriva-v1-card-026": ["VIDEO", "COPIAR_ENERGIA", "PROVOCACAO"],
  "deriva-v1-card-027": ["ORAL", "PROVOCACAO", "RESPIRO"],
  "deriva-v1-card-028": ["COMANDO_DELA", "COMANDO_DELE", "ORAL", "MAOS"],
  "deriva-v1-card-029": ["FOCO_CASAL", "PENETRACAO"],
  "deriva-v1-card-030": ["CONTROLE_DELA", "FOCO_NELA", "PENETRACAO"],
  "deriva-v1-card-031": ["PENETRACAO", "FOCO_CASAL"],
  "deriva-v1-card-032": ["PENETRACAO", "PROIBICAO"],
  "deriva-v1-card-033": ["CONTROLE_DELA", "ENCERRAMENTO"],
  "deriva-v1-card-034": ["PROIBICAO", "SEM_PENETRACAO", "PROVOCACAO"],
  "deriva-v1-card-035": ["PENETRACAO", "FOCO_CASAL"],
  "deriva-v1-card-036": ["ROLEPLAY", "FANTASIA", "DIRTY_TALK"],
  "deriva-v1-card-037": ["FANTASIA", "PROVOCACAO"],
  "deriva-v1-card-038": ["COMANDO_DELA", "COMANDO_DELE", "DIRTY_TALK"],
  "deriva-v1-card-039": ["ROLEPLAY", "FANTASIA", "DIRTY_TALK"],
  "deriva-v1-card-040": ["ROLEPLAY", "MASSAGEM", "TOQUE"],
  "deriva-v1-card-041": ["TERCEIRO_IMAGINARIO", "FANTASIA", "PROVOCACAO"],
  "deriva-v1-card-042": ["PROIBICAO", "PROVOCACAO", "RESPIRO"]
};

// Fix invalid tags
for (const key in cardTags) {
    cardTags[key] = cardTags[key].filter(tag => tag !== "BOCA");
    if (key === "deriva-v1-card-003") cardTags[key].push("BEIJO");
}

async function main() {
  console.log("Updating card tags...");
  for (const [key, tags] of Object.entries(cardTags)) {
    await prisma.card.update({
      where: { system_key: key },
      data: { tags: tags as CardTag[] }
    });
  }
  console.log("Tags updated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
