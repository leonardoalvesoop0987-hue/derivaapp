import { prisma } from "@/lib/db";
import type { CardIntensity, SessionMode, SessionLength, SessionStage, Card } from "@prisma/client";

const INTENSITY_WEIGHTS: Record<CardIntensity, number> = {
  LEVE: 1,
  QUENTE: 2,
  INTENSO: 3,
  PICO: 4,
};

type NextCardInput = {
  userId: string;
  sessionId: string;
  deckId: string;
  mode: SessionMode;
  length: SessionLength;
  maxIntensity: CardIntensity;
  videosEnabled: boolean;
  shownCardIds: string[];
  currentPosition: number;
  targetCardCount: number;
  preferencesJson?: string | null;
};

export type GeneratedSessionCard = {
  card_id: string;
  position: number;
  metadata_json: string;
};

function getExpectedStages(position: number, totalCount: number): SessionStage[] {
  const progress = position / Math.max(1, totalCount - 1); // 0.0 to 1.0
  if (progress < 0.15) return ["OPENING"];
  if (progress < 0.3) return ["WARMUP", "OPENING"];
  if (progress < 0.45) return ["TEASING", "WARMUP"];
  if (progress < 0.6) return ["BUILDUP", "TEASING"];
  if (progress < 0.8) return ["INTENSE", "BUILDUP"];
  if (progress < 0.9) return ["PEAK", "INTENSE"];
  if (progress < 0.95) return ["COOLDOWN", "PEAK"];
  return ["CLOSING", "COOLDOWN"];
}

async function getNextCard(input: NextCardInput, sequenceSoFar: Card[]): Promise<Card | null> {
  const deck = await prisma.deck.findUnique({ where: { id: input.deckId } });
  if (!deck) return null;

  let availableCards: Card[] = [];

  if (deck.type === "COUPLE_CUSTOM" || deck.type === "CUSTOM") {
    const deckCards = await prisma.deckCard.findMany({
      where: { deck_id: input.deckId, is_active: true },
      include: { card: true }
    });
    // In custom decks, the card must be available for custom selection
    availableCards = deckCards.map(dc => dc.card).filter(c => c.is_active && c.is_available_in_custom_selection && !input.shownCardIds.includes(c.id));
  } else {
    // For System or Official decks
    availableCards = await prisma.card.findMany({
      where: {
        deck_id: input.deckId,
        is_active: true,
        id: { notIn: input.shownCardIds },
      },
    });

    if (deck.is_default) {
      availableCards = availableCards.filter(c => c.is_available_in_default);
    }
  }

  // Filter based on unlocks
  const unlocks = await prisma.coupleUnlock.findMany({
    where: { user_id: input.userId, is_enabled: true }
  });
  const unlockedKeys = unlocks.map(u => u.unlock_group_key);

  availableCards = availableCards.filter(c => 
    !c.requires_couple_unlock || (c.unlock_group_key && unlockedKeys.includes(c.unlock_group_key))
  );

  const preferences = await prisma.userCardPreference.findMany({
    where: { user_id: input.userId, card_id: { in: availableCards.map((c) => c.id) } },
  });
  const prefMap = new Map(preferences.map((p) => [p.card_id, p]));

  availableCards = availableCards.filter((c) => !prefMap.get(c.id)?.is_removed);

  if (!input.videosEnabled) {
    availableCards = availableCards.filter((c) => !c.requires_video);
  }

  let experienceType = "COMPLETA";
  let kinkLevel = "NORMAL";
  if (input.mode === "COM_PREFERENCIAS" && input.preferencesJson) {
    try {
      const prefs = JSON.parse(input.preferencesJson);
      experienceType = prefs.experienceType || "COMPLETA";
      kinkLevel = prefs.kinkLevel || "NORMAL";
    } catch(e) {}
  }

  // Hard constraints based on mode
  if (input.mode === "ESTREIA") {
    availableCards = availableCards.filter(c => (c.intensity === "LEVE" || c.intensity === "QUENTE") && c.is_available_in_estreia);
  } else if (input.mode === "COM_PREFERENCIAS") {
    if (experienceType === "SEM_VIDEO") availableCards = availableCards.filter(c => !c.requires_video);
    if (experienceType === "MAIS_ORAL") availableCards = availableCards.filter(c => c.primary_tag !== "PENETRACAO");
    if (kinkLevel === "DESATIVADO") availableCards = availableCards.filter(c => c.category !== "PRETO");
  }

  // Intensity cap
  const maxAllowedWeight = INTENSITY_WEIGHTS[input.maxIntensity];
  availableCards = availableCards.filter(c => INTENSITY_WEIGHTS[c.intensity] <= maxAllowedWeight);

  if (availableCards.length === 0) return null;

  const expectedStages = getExpectedStages(input.currentPosition, input.targetCardCount);
  const lastCard = sequenceSoFar.length > 0 ? sequenceSoFar[sequenceSoFar.length - 1] : null;

  const scoredCards = availableCards.map(candidate => {
    let score = 100;
    
    // Stage matching
    if (expectedStages[0] === candidate.stage) score += 50;
    else if (expectedStages[1] === candidate.stage) score += 20;
    else score -= 30; // Penalize off-stage cards

    // Repetition avoidance
    if (lastCard) {
      if (candidate.primary_tag === lastCard.primary_tag && candidate.primary_tag !== null) score -= 80;
      if (candidate.erotic_function === lastCard.erotic_function && candidate.erotic_function !== null) score -= 40;
      if (candidate.progression_role === lastCard.progression_role && candidate.progression_role !== null) score -= 30;
      if (candidate.receiver_rule === lastCard.receiver_rule && candidate.receiver_rule !== "NONE" && candidate.receiver_rule !== "ANY") score -= 20;
    }

    // Preferences
    const pref = prefMap.get(candidate.id);
    if (pref) {
      if (pref.is_favorite) score += 40;
      if (pref.skip_count > 0) score -= Math.min(pref.skip_count * 15, 60);
    }

    return { card: candidate, score };
  });

  // Filter out negative scores unless it's empty
  let candidates = scoredCards.filter(c => c.score > 0);
  if (candidates.length === 0) {
    candidates = scoredCards;
  }

  // Softmax-like weighted random
  const totalScore = candidates.reduce((sum, c) => sum + c.score, 0);
  let random = Math.random() * totalScore;
  for (const { card, score } of candidates) {
    random -= score;
    if (random <= 0) return card;
  }

  return candidates[candidates.length - 1].card;
}

export async function generateSessionSequence(input: NextCardInput & { preferencesJson?: string | null }): Promise<GeneratedSessionCard[]> {
  const sequence: GeneratedSessionCard[] = [];
  const shownCardIds: string[] = [...(input.shownCardIds || [])];
  const sequenceSoFar: Card[] = [];

  for (let pos = 0; pos < input.targetCardCount; pos++) {
    // If it's a SKIP generation, pos should be input.currentPosition
    // But this function is used to generate either the full sequence or just 1 card.
    // If targetCardCount is 1 (like when skipping), we need to ensure getExpectedStages gets the RIGHT position out of the full session length.
    // For SKIP, currentPosition is passed as the parameter, but we want to know what the target position is relative to session.target_card_count!
    // Wait, let's fix the API of this.
    // Actually, we can use input.currentPosition directly for the stage if targetCardCount === 1.
    const actualPos = input.targetCardCount === 1 ? input.currentPosition : pos;
    const actualTargetCount = input.targetCardCount === 1 ? (input as Record<string, unknown>).fullTargetCardCount || 10 : input.targetCardCount;

    const card = await getNextCard({
      ...input,
      currentPosition: actualPos,
      targetCardCount: actualTargetCount,
      shownCardIds,
    }, sequenceSoFar);

    if (!card) break;

    shownCardIds.push(card.id);
    sequenceSoFar.push(card);

    const metadata = buildCardMetadata(card);

    sequence.push({
      card_id: card.id,
      position: actualPos,
      metadata_json: JSON.stringify(metadata),
    });
  }

  return sequence;
}

export function buildCardMetadata(card: Record<string, unknown>) {
  let receiver = card.receiver_rule;
  if (receiver === "ANY") {
    receiver = Math.random() > 0.5 ? "MAN" : "WOMAN";
  }

  const fronts = {
    AZUL: ["Aquecendo os motores...", "Hora de criar conexão.", "Sem pressa, o clima tá só começando.", "Olha bem no olho agora."],
    DERIVA: ["Deixa rolar...", "O clima tá subindo.", "Sinta o momento.", "Sem pensar muito, só aproveita."],
    ROSA: ["Toque com intenção.", "Agora o corpo fala.", "Explorando novos caminhos.", "Sente a pele."],
    ROXO: ["Inspiração para vocês.", "Deixa a mente viajar.", "Assista e aprenda...", "O clima acabou de esquentar mais."],
    VERMELHO: ["O bicho vai pegar.", "Sem limites agora.", "Entrega total.", "Aqui a brincadeira fica séria."],
    PRETO: ["Surpresa selvagem.", "Intensidade máxima.", "Vocês aguentam?", "Passando dos limites."]
  };

  const categoryFronts = fronts[card.category as keyof typeof fronts] || fronts.DERIVA;
  const front_text = categoryFronts[Math.floor(Math.random() * categoryFronts.length)];

  let rendered_body = (card.body as string) || "";
  
  if (receiver === "MAN") {
    rendered_body = rendered_body
      .replace(/quem conduz/gi, "ela")
      .replace(/quem recebe/gi, "ele")
      .replace(/A mulher/gi, "Gata, você")
      .replace(/a mulher/gi, "você, gata")
      .replace(/O homem/gi, "Ele")
      .replace(/o homem/gi, "ele")
      .replace(/A outra pessoa/gi, "Ele")
      .replace(/a outra pessoa/gi, "ele");
  } else if (receiver === "WOMAN") {
    rendered_body = rendered_body
      .replace(/quem conduz/gi, "ele")
      .replace(/quem recebe/gi, "ela")
      .replace(/A mulher/gi, "Ela")
      .replace(/a mulher/gi, "ela")
      .replace(/O homem/gi, "Cara, você")
      .replace(/o homem/gi, "você, cara")
      .replace(/A outra pessoa/gi, "Ela")
      .replace(/a outra pessoa/gi, "ela");
  } else {
    rendered_body = rendered_body
      .replace(/Quem conduz/gi, "Você")
      .replace(/quem conduz/gi, "você")
      .replace(/Quem recebe/gi, "Seu parceiro(a)")
      .replace(/quem recebe/gi, "seu parceiro(a)")
      .replace(/A outra pessoa/gi, "A outra pessoa")
      .replace(/a outra pessoa/gi, "a outra pessoa");
  }

  rendered_body = rendered_body.replace(/Tempo (máximo|sugerido):.*?(minutos?|segundos?)/gi, "").trim();

  return {
    front_text,
    rendered_body,
    original_receiver: receiver,
    current_receiver: receiver,
  };
}
