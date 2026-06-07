import { prisma } from "@/lib/db";
import type { CardIntensity, SessionMode, SessionLength, SessionStage, Card, CardRandomOption, SessionFocus } from "@prisma/client";

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
  sessionFocus?: SessionFocus | string;
  temperature?: number;
  categoryBias?: string;
  decayMap?: Map<string, number>;
  disableDarkPenalty?: boolean;
};

export type GeneratedSessionCard = {
  card_id: string;
  random_option_id?: string | null;
  position: number;
  metadata_json: string;
};

function pickWeightedOption(options: CardRandomOption[]): CardRandomOption | null {
  const totalWeight = options.reduce((sum, option) => sum + Math.max(1, option.weight), 0);
  if (totalWeight <= 0) return options[0] ?? null;

  let random = Math.random() * totalWeight;
  for (const option of options) {
    random -= Math.max(1, option.weight);
    if (random <= 0) return option;
  }

  return options[options.length - 1] ?? null;
}

async function drawRandomOption(card: Card): Promise<CardRandomOption | null> {
  if (!card.random_options_enabled) return null;

  const cardIntensityWeight = INTENSITY_WEIGHTS[card.intensity];
  const options = await prisma.cardRandomOption.findMany({
    where: {
      card_id: card.id,
      is_active: true,
      requires_unlock: false,
    },
    orderBy: { created_at: "asc" },
  });

  const eligibleOptions = options.filter((option) => {
    const minWeight = option.min_intensity ? INTENSITY_WEIGHTS[option.min_intensity] : null;
    const maxWeight = option.max_intensity ? INTENSITY_WEIGHTS[option.max_intensity] : null;
    if (minWeight !== null && cardIntensityWeight < minWeight) return false;
    if (maxWeight !== null && cardIntensityWeight > maxWeight) return false;
    return true;
  });

  return pickWeightedOption(eligibleOptions);
}

function getExpectedStages(position: number, totalCount: number): SessionStage[] {
  const progress = position / Math.max(1, totalCount - 1); // 0.0 to 1.0
  if (progress < 0.1) return ["OPENING"]; // 1. abrir clima
  if (progress < 0.2) return ["WARMUP", "OPENING"]; // 2. reduzir vergonha
  if (progress < 0.3) return ["TEASING", "WARMUP"]; // 3. criar toque
  if (progress < 0.4) return ["BUILDUP", "TEASING"]; // 4. aumentar tensão
  if (progress < 0.5) return ["BUILDUP", "INTENSE"]; // 5. escolher foco
  if (progress < 0.6) return ["INTENSE", "BUILDUP"]; // 6. intensificar
  if (progress < 0.7) return ["COOLDOWN", "TEASING"]; // 7. respiro estratégico
  if (progress < 0.8) return ["INTENSE", "PEAK"]; // 8. voltar mais quente
  if (progress < 0.9) return ["PEAK", "INTENSE"]; // 9. pico
  return ["CLOSING", "COOLDOWN"]; // 10. fechamento
}

async function getNextCard(input: NextCardInput & { forceStage?: SessionStage }, sequenceSoFar: Card[]): Promise<Card | null> {
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
    } catch {}
  }

  // Hard constraints based on mode
  if (input.mode === "ESTREIA") {
    availableCards = availableCards.filter(c => (c.intensity === "LEVE" || c.intensity === "QUENTE") && c.is_available_in_estreia && c.unlock_group_key !== "DARK_THIRD_IMAGINATION");
  } else if (input.mode === "COM_PREFERENCIAS") {
    if (experienceType === "SEM_VIDEO") availableCards = availableCards.filter(c => !c.requires_video);
    if (experienceType === "MAIS_ORAL") availableCards = availableCards.filter(c => c.primary_tag !== "PENETRACAO");
    if (kinkLevel === "DESATIVADO") availableCards = availableCards.filter(c => c.category !== "PRETO");
  }

  // Intensity cap
  const maxAllowedWeight = INTENSITY_WEIGHTS[input.maxIntensity];
  availableCards = availableCards.filter(c => INTENSITY_WEIGHTS[c.intensity] <= maxAllowedWeight);

  if (availableCards.length === 0) return null;

  const expectedStages = input.forceStage ? [input.forceStage] : getExpectedStages(input.currentPosition, input.targetCardCount);
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

    // Smart progression rules - avoid illogical sequences
    if (lastCard) {
      // Rule 1: Avoid ORAL_NELA (card 015) after PENETRACAO
      // Jumping back to oral without video after penetration is a regression
      if (lastCard.primary_tag === "PENETRACAO" && candidate.primary_tag === "ORAL_NELA") {
        score -= 999;
      }

      // Rule 2: Avoid SEM_PENETRAÇÃO after PENETRAÇÃO has started
      // Removing penetration after it's already happened doesn't make sense
      if (lastCard.primary_tag === "PENETRACAO" && candidate.primary_tag === "SEM_PENETRAÇÃO") {
        score -= 100;
      }

      // Rule 3: Prefer VIDEO stimulation cards (ROXO) after manual pleasure (ROSA)
      // Video is more intense and provides visual stimulation escalation
      if ((lastCard.primary_tag === "COMANDO_DELA" ||
           lastCard.primary_tag === "CONTROLE_DELA" ||
           lastCard.primary_tag === "ORAL_NELA") &&
          candidate.requires_video &&
          candidate.primary_tag === "VIDEO") {
        score += 35;
      }

      // Rule 4: After PENETRAÇÃO, only allow video-based ORAL/pleasure (cards 022-026)
      // Video-based cards are more intense and serve as escalation, not regression
      if (lastCard.primary_tag === "PENETRACAO" &&
          !candidate.requires_video &&
          (candidate.primary_tag === "COMANDO_DELA" ||
           candidate.primary_tag === "CONTROLE_DELA" ||
           candidate.primary_tag === "ORAL_NELA")) {
        score -= 80;
      }
    }

    // Avoid returning to OPENING stage after INTENSE/PEAK has been reached
    if (input.currentPosition > 3 && lastCard &&
        (lastCard.stage === "INTENSE" || lastCard.stage === "PEAK") &&
        candidate.stage === "OPENING") {
      score -= 70;
    }

    // Avoid excessive ROLEPLAY repetition (max 1 per 5 cards)
    const recentRoleplayCount = sequenceSoFar
      .slice(Math.max(0, sequenceSoFar.length - 5))
      .filter(c => c.primary_tag === "ROLEPLAY")
      .length;
    if (recentRoleplayCount >= 2 && candidate.primary_tag === "ROLEPLAY") {
      score -= 60;
    }

    // Preferences
    const pref = prefMap.get(candidate.id);
    if (pref) {
      if (pref.is_favorite) score += 40;
      if (pref.skip_count > 0) score -= Math.min(pref.skip_count * 15, 60);
    }

    // Penalize dark content in PADRAO mode so it's rare, unless disabled
    if (input.mode === "PADRAO" && candidate.unlock_group_key === "DARK_THIRD_IMAGINATION" && !input.disableDarkPenalty) {
      score -= 50; 
    }

    // Category Bias
    if (input.categoryBias && candidate.category === input.categoryBias) {
      score *= 3; 
    }

    // Decay Penalty
    if (input.decayMap && input.decayMap.has(candidate.id)) {
      const lastTime = input.decayMap.get(candidate.id)!;
      const daysSince = (Date.now() - lastTime) / 86400000;
      const decayMultiplier = Math.min(1, daysSince / 7);
      score *= Math.max(0.2, decayMultiplier);
    }

    return { card: candidate, score };
  });

  // Filter out negative scores unless it's empty
  let candidates = scoredCards.filter(c => c.score > 0);
  if (candidates.length === 0) {
    candidates = scoredCards;
  }

  // Apply temperature
  const temp = Math.max(0.4, Math.min(2.5, input.temperature || 1.0));
  candidates = candidates.map(c => ({
    card: c.card,
    score: Math.pow(Math.max(c.score, 1), 1 / temp)
  }));

  // Softmax-like weighted random
  const totalScore = candidates.reduce((sum, c) => sum + c.score, 0);
  let random = Math.random() * totalScore;
  for (const { card, score } of candidates) {
    random -= score;
    if (random <= 0) return card;
  }

  return candidates[candidates.length - 1].card;
}

export async function generateSessionSequence(input: NextCardInput & { preferencesJson?: string | null, forceStage?: SessionStage, fullTargetCardCount?: number, sessionFocus?: SessionFocus | string }): Promise<GeneratedSessionCard[]> {
  const sequence: GeneratedSessionCard[] = [];
  const shownCardIds: string[] = [...(input.shownCardIds || [])];
  const sequenceSoFar: Card[] = [];

  if (input.mode === "NOITE_ESPECIAL") {
    const especialKeys = [
      "deriva-v2-card-001",
      "deriva-v2-card-003",
      "deriva-v2-card-004",
      "deriva-v2-card-009",
      "deriva-v2-card-012",
      "deriva-v2-card-015",
      "deriva-v2-card-019",
      "deriva-v2-card-023",
      "deriva-v2-card-035",
      "deriva-v2-card-040",
      "deriva-v2-card-046",
      "deriva-v2-card-047"
    ];

    if (input.targetCardCount > 1) {
      const cards = await prisma.card.findMany({ where: { system_key: { in: especialKeys } } });
      const cardMap = new Map(cards.map(c => [c.system_key, c]));
      for (let pos = 0; pos < Math.min(input.targetCardCount, especialKeys.length); pos++) {
        const key = especialKeys[pos];
        const card = cardMap.get(key);
        if (!card) continue;
        const metadata = buildCardMetadata(card, input.sessionFocus) as Record<string, unknown>;
        metadata.intended_stage = getExpectedStages(pos, input.targetCardCount)[0];
        if (card.session_short_text) {
          metadata.rendered_short_text = applyPronounRegex(card.session_short_text, metadata.current_receiver as string);
        }
        sequence.push({ card_id: card.id, random_option_id: null, position: pos, metadata_json: JSON.stringify(metadata) });
      }
      return sequence;
    } else {
      const cards = await prisma.card.findMany({ where: { system_key: { in: especialKeys } } });
      const availableCards = especialKeys.map(k => cards.find(c => c?.system_key === k)).filter(c => c && !input.shownCardIds.includes(c.id));
      const card = availableCards[0] || cards[cards.length - 1];
      
      if (card) {
        const metadata = buildCardMetadata(card, input.sessionFocus) as Record<string, unknown>;
        metadata.intended_stage = getExpectedStages(input.currentPosition, 12)[0];
        if (card.session_short_text) {
          metadata.rendered_short_text = applyPronounRegex(card.session_short_text, metadata.current_receiver as string);
        }
        sequence.push({ card_id: card.id, random_option_id: null, position: input.currentPosition, metadata_json: JSON.stringify(metadata) });
      }
      return sequence;
    }
  }

  // Fetch decay history if not provided
  if (!input.decayMap) {
    const lastShownRecords = await prisma.sessionCard.groupBy({
      by: ['card_id'],
      _max: { completed_at: true },
      where: {
        status: "COMPLETED",
        session: { user_id: input.userId }
      }
    });
    input.decayMap = new Map(lastShownRecords.map(r => [r.card_id, r._max.completed_at?.getTime() || 0]));
  }

  for (let pos = 0; pos < input.targetCardCount; pos++) {
    // If it's a SKIP generation, pos should be input.currentPosition
    // But this function is used to generate either the full sequence or just 1 card.
    // If targetCardCount is 1 (like when skipping), we need to ensure getExpectedStages gets the RIGHT position out of the full session length.
    // For SKIP, currentPosition is passed as the parameter, but we want to know what the target position is relative to session.target_card_count!
    // Wait, let's fix the API of this.
    // Actually, we can use input.currentPosition directly for the stage if targetCardCount === 1.
    const actualPos = input.targetCardCount === 1 ? input.currentPosition : pos;
    const actualTargetCount = input.targetCardCount === 1 ? input.fullTargetCardCount || 10 : input.targetCardCount;

    const card = await getNextCard({
      ...input,
      currentPosition: actualPos,
      targetCardCount: actualTargetCount,
      shownCardIds,
      forceStage: input.forceStage,
    }, sequenceSoFar);

    if (!card) break;

    shownCardIds.push(card.id);
    sequenceSoFar.push(card);

    let expectedStagesForPos = input.forceStage ? [input.forceStage] : getExpectedStages(actualPos, actualTargetCount);
    
    // MERGULHO Hot Start
    if (input.mode === "MERGULHO" && actualPos === 0) {
      expectedStagesForPos = ["INTENSE", "TRANSITION"];
    }
    
    // Conditional COOLDOWN
    if (!input.forceStage) {
      const recentCards = sequenceSoFar.slice(-3);
      const intenseCount = recentCards.filter(c => c.intensity === "INTENSO" || c.intensity === "PICO").length;
      if (intenseCount >= 2 && actualPos > 2 && actualPos < actualTargetCount - 2) {
        // Prevent back-to-back cooldowns
        if (recentCards.length === 0 || recentCards[recentCards.length - 1].stage !== "COOLDOWN") {
          expectedStagesForPos = ["COOLDOWN", "TRANSITION"];
        }
      }

      // Gradual CLOSING for MEDIA/COMPLETA
      if (input.length !== "CURTA" && actualPos >= actualTargetCount - 2) {
        expectedStagesForPos = ["CLOSING", "COOLDOWN"];
      } else if (actualPos === actualTargetCount - 1) {
        expectedStagesForPos = ["CLOSING", "COOLDOWN"];
      }
    }

    const metadata = buildCardMetadata(card, input.sessionFocus) as Record<string, unknown>;
    metadata.intended_stage = expectedStagesForPos[0];
    if (card.session_short_text) {
      metadata.rendered_short_text = applyPronounRegex(card.session_short_text, metadata.current_receiver as string);
    }

    const randomOption = await drawRandomOption(card);
    if (randomOption) {
      const optionFullText = randomOption.instruction_full?.trim() || randomOption.instruction_short?.trim() || card.body;
      const optionShortText = randomOption.instruction_short?.trim() || randomOption.instruction_full?.trim() || card.session_short_text || optionFullText;
      const receiver = metadata.current_receiver as string;

      metadata.random_option_id = randomOption.id;
      metadata.random_option_label = randomOption.label;
      metadata.card_base_body = card.body;
      metadata.card_base_short_text = card.session_short_text;
      metadata.original_body = optionFullText;
      metadata.original_short_text = optionShortText;
      metadata.rendered_body = applyPronounRegex(optionFullText, receiver);
      metadata.rendered_short_text = applyPronounRegex(optionShortText, receiver);
    }

    sequence.push({
      card_id: card.id,
      random_option_id: randomOption?.id ?? null,
      position: actualPos,
      metadata_json: JSON.stringify(metadata),
    });
  }

  return sequence;
}

export function applyPronounRegex(bodyText: string, receiver: string): string {
  let rendered_body = bodyText || "";
  
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
      .replace(/Quem recebe/gi, "Quem está na sua frente")
      .replace(/quem recebe/gi, "quem está na sua frente")
      .replace(/A mulher/gi, "A gata")
      .replace(/a mulher/gi, "a gata")
      .replace(/O homem/gi, "O parceiro")
      .replace(/o homem/gi, "o parceiro")
      .replace(/A outra pessoa/gi, "Ele ou Ela")
      .replace(/a outra pessoa/gi, "ele ou ela");
  }

  rendered_body = rendered_body.replace(/Tempo (máximo|sugerido):.*?(minutos?|segundos?)/gi, "").trim();

  return rendered_body;
}

export function buildCardMetadata(card: Record<string, unknown>, sessionFocus?: SessionFocus | string) {
  let receiver = card.receiver_rule as string;
  if (receiver === "ANY") {
    let prob = 0.5;
    if (sessionFocus === "FOR_HER") prob = 0.9;
    if (sessionFocus === "FOR_HIM") prob = 0.1;
    receiver = Math.random() < prob ? "WOMAN" : "MAN";
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

  let rendered_body = applyPronounRegex((card.body as string) || "", receiver);

  rendered_body = rendered_body.replace(/Tempo (máximo|sugerido):.*?(minutos?|segundos?)/gi, "").trim();

  return {
    front_text,
    rendered_body,
    original_body: card.body,
    original_receiver: receiver,
    current_receiver: receiver,
  };
}
