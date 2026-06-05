import { prisma } from "@/lib/db";
import { MediaAsset } from "@prisma/client";

// Mappings for weights when Receiver is WOMAN
const WOMAN_CAT_WEIGHTS: Record<string, number> = {
  "LESBICO": 70,
  "MF": 12,
  "FFM": 9,
  "MMF": 9
};

// Mappings for weights when Receiver is MAN
const MAN_CAT_WEIGHTS: Record<string, number> = {
  "FFM": 80,
  "MF": 12,
  "LESBICO": 8,
  "MMF": 0
};

export async function drawVideoAdvanced(cardId: string, excludeIds: string[] = []): Promise<MediaAsset | null> {
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) return null;

  // Retrieve basic info from card
  const receiver = card.receiver_rule || "ANY"; // MAN, WOMAN, ANY, NONE
  let metadata: Record<string, unknown> = {};
  try {
    if (card.metadata_json) metadata = JSON.parse(card.metadata_json);
  } catch {}

  const isEnergyCopy = metadata.video_context === 'ENERGY_COPY' || metadata.is_energy_copy_context === true;
  const isOralReceiving = metadata.is_oral_receiving_context === true || metadata.video_context === 'ORAL_RECEIVING';

  // 1. Fetch all ACTIVE and READY videos
  const availableVideos = await prisma.mediaAsset.findMany({
    where: {
      type: "VIDEO",
      is_active: true,
      processing_status: "READY",
      id: { notIn: excludeIds }
    }
  });

  if (availableVideos.length === 0) return null;

  // 2. Score each video
  let scoredVideos = availableVideos.map(v => {
    let score = 0;
    const cat = v.video_category || "OUTRO";
    const content = v.content_type || "COMPLETE";
    const tags = v.visual_tags || [];

    let isDisqualified = false;

    // RULE: PENETRATION_ONLY rarely allowed except energy copy
    if (content === "PENETRATION_ONLY" && !isEnergyCopy) {
      // It says "not used in oral/hands cards". We'll just heavily penalize or disqualify if it's oral receiving
      if (isOralReceiving) isDisqualified = true;
      else score -= 100; // Penalize normally
    }

    if (receiver === "WOMAN") {
      score += (WOMAN_CAT_WEIGHTS[cat] || 0);

      if (content === "ORAL_ONLY") score += 20;
      if (content === "COMPLETE") score += 10;
      if (tags.includes("NO_FACE")) score += 30;
      if (tags.includes("POV")) score += 10;
      if (tags.includes("NO_FACE") && tags.includes("POV")) score += 20;

    } else if (receiver === "MAN") {
      score += (MAN_CAT_WEIGHTS[cat] || 0);

      // Rule: MMF not allowed for him
      if (cat === "MMF") isDisqualified = true;

      // Rule: MF for him REQUIRES POV
      if (cat === "MF" && !tags.includes("POV")) {
        isDisqualified = true;
      }

      // Rule: If he is receiving oral, do not show oral of woman on man
      if (isOralReceiving) {
        if (cat === "MMF" || (cat === "MF" && content === "ORAL_ONLY") || (cat === "MF" && content === "COMPLETE") || (cat === "LESBICO" && !tags.includes("NO_FACE"))) {
          isDisqualified = true;
        }
      }

      if (tags.includes("NO_FACE")) score += 30;
      if (tags.includes("POV")) score += 20;

    } else {
      // ANY / NONE fallback
      score += 50; // Base
      if (tags.includes("POV")) score += 10;
      if (tags.includes("NO_FACE")) score += 10;
    }

    return { video: v, score, isDisqualified };
  });

  // Filter out disqualified
  scoredVideos = scoredVideos.filter(v => !v.isDisqualified && v.score > 0);

  if (scoredVideos.length === 0) {
    // Fallback: relax rules and take ANY active ready video, but still respect STRONG rules
    const fallbackVideos = availableVideos.filter(v => {
      const cat = v.video_category;
      if (receiver === "MAN" && cat === "MMF") return false;
      if (receiver === "MAN" && cat === "MF" && !v.visual_tags.includes("POV")) return false;
      return true;
    });

    if (fallbackVideos.length === 0) {
      // Total fallback, return random active ready
      return availableVideos[Math.floor(Math.random() * availableVideos.length)];
    }

    return fallbackVideos[Math.floor(Math.random() * fallbackVideos.length)];
  }

  // Weighted random pick from scored
  const totalScore = scoredVideos.reduce((sum, item) => sum + item.score, 0);
  let random = Math.random() * totalScore;
  
  for (const item of scoredVideos) {
    random -= item.score;
    if (random <= 0) return item.video;
  }

  return scoredVideos[scoredVideos.length - 1].video;
}
