import { prisma } from "@/lib/db";
import type { CardIntensity, SessionMode, SessionLength } from "@prisma/client";

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
};

export async function getNextCard(input: NextCardInput) {
  // 1. Fetch cards not shown yet, respecting is_active
  let availableCards = await prisma.card.findMany({
    where: {
      deck_id: input.deckId,
      is_active: true,
      id: { notIn: input.shownCardIds },
    },
  });

  // 2. Fetch user preferences to filter removed cards and apply weights
  const preferences = await prisma.userCardPreference.findMany({
    where: { user_id: input.userId, card_id: { in: availableCards.map((c) => c.id) } },
  });
  const prefMap = new Map(preferences.map((p) => [p.card_id, p]));

  // Remove cards marked as is_removed by user
  availableCards = availableCards.filter((c) => {
    const pref = prefMap.get(c.id);
    return !pref?.is_removed;
  });

  // 3. Filter out videos if disabled
  if (!input.videosEnabled) {
    availableCards = availableCards.filter((c) => !c.requires_video);
  }

  // 4. Mode restrictions
  if (input.mode === "ESTREIA") {
    availableCards = availableCards.filter(
      (c) => c.intensity === "LEVE" || c.intensity === "QUENTE"
    );
  }

  // 5. Max intensity restriction
  const maxAllowedWeight = INTENSITY_WEIGHTS[input.maxIntensity];
  availableCards = availableCards.filter(
    (c) => INTENSITY_WEIGHTS[c.intensity] <= maxAllowedWeight
  );

  // 6. Position-based category rules
  let allowedCategories: string[] = Object.keys(INTENSITY_WEIGHTS).length > 0 
    ? ["AZUL", "DERIVA", "ROSA", "ROXO", "VERMELHO", "PRETO"]
    : [];
  let maxPosIntensityWeight = maxAllowedWeight;

  const isFirstCard = input.currentPosition === 0;
  const isSecondCard = input.currentPosition === 1;
  const isBeforeHalf = input.currentPosition < input.targetCardCount / 2;
  const isLastCard = input.currentPosition >= input.targetCardCount - 1;

  if (isFirstCard) {
    allowedCategories = ["AZUL"];
  } else if (isSecondCard) {
    allowedCategories = ["AZUL", "DERIVA"];
  } else if (isLastCard) {
    allowedCategories = ["DERIVA"];
  } else if (input.currentPosition >= 3 && input.currentPosition % 4 === 0) {
    allowedCategories = ["DERIVA"];
  }

  if (isBeforeHalf && !isFirstCard) {
    maxPosIntensityWeight = Math.min(maxPosIntensityWeight, INTENSITY_WEIGHTS["INTENSO"]);
  }

  // 7. Apply category + intensity constraints
  let filtered = availableCards.filter(
    (c) =>
      allowedCategories.includes(c.category) &&
      INTENSITY_WEIGHTS[c.intensity] <= maxPosIntensityWeight
  );

  // Fallback 1: relax category, keep intensity
  if (filtered.length === 0) {
    filtered = availableCards.filter(
      (c) => INTENSITY_WEIGHTS[c.intensity] <= maxPosIntensityWeight
    );
  }

  // Fallback 2: relax intensity too, but never above global max
  if (filtered.length === 0) {
    filtered = availableCards.filter(
      (c) => INTENSITY_WEIGHTS[c.intensity] <= maxAllowedWeight
    );
  }

  // Fallback 3: null → caller handles graceful end
  if (filtered.length === 0) return null;

  // 8. Apply weights based on user preferences
  const weightedCandidates: { card: typeof filtered[0]; weight: number }[] = filtered.map((card) => {
    const pref = prefMap.get(card.id);
    let weight = 1;

    if (pref) {
      if (pref.is_favorite) weight += 2;           // Favoritas ganham peso
      if (pref.skip_count > 0) weight -= Math.min(pref.skip_count * 0.5, 0.9); // Puladas perdem peso
    }

    // Ensure weight is always positive
    weight = Math.max(weight, 0.1);
    return { card, weight };
  });

  // 9. Weighted random selection
  const totalWeight = weightedCandidates.reduce((sum, { weight }) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  for (const { card, weight } of weightedCandidates) {
    random -= weight;
    if (random <= 0) return card;
  }

  return weightedCandidates[weightedCandidates.length - 1].card;
}
