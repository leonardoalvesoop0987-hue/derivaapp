import { prisma } from "@/lib/db";
import { MediaAsset } from "@prisma/client";

/**
 * SIMPLIFIED VIDEO DRAW: Single random draw from all playable videos
 *
 * Elegibility rule (ONLY):
 * - status = 'READY' (processing_status)
 * - active = true (is_active)
 * - URL/HLS valid (hls_master_key NOT NULL)
 *
 * Classification (category/type/tags) is PURELY ORGANIZATIONAL:
 * - NEVER filters eligibility
 * - NEVER weights the draw
 * - Can be NULL/empty — video still appears
 *
 * All draws in the app now use this function:
 * - Cena Solta
 * - Cartas Roxas
 * - Cartas com vídeo em sessão
 * - Tela para ela / Tela para ele
 */
export async function getRandomPlayableVideo(excludeIds: string[] = []): Promise<MediaAsset | null> {
  const playableVideos = await prisma.mediaAsset.findMany({
    where: {
      type: "VIDEO",
      is_active: true,
      processing_status: "READY",
      hls_master_key: { not: null },
      id: { notIn: excludeIds }
    },
    orderBy: { id: 'asc' } // Stable ordering for database
  });

  if (playableVideos.length === 0) return null;

  // Simple random selection
  return playableVideos[Math.floor(Math.random() * playableVideos.length)];
}

/**
 * DEPRECATED: Advanced weighted draw (kept for reference/audit)
 * This function is NO LONGER USED in the app.
 * All video draws now use getRandomPlayableVideo() instead.
 *
 * This was previously used to implement:
 * - 70% LESBICO for WOMAN receiver
 * - 80% FFM for MAN receiver
 * - Content-type penalties/bonuses
 * - Tag-based scoring (POV, NO_FACE)
 *
 * @deprecated Use getRandomPlayableVideo() instead
 */
export async function drawVideoAdvanced(
  cardId: string,
  excludeIds: string[] = []
): Promise<MediaAsset | null> {
  console.warn(
    "[DEPRECATED] drawVideoAdvanced called. Use getRandomPlayableVideo() instead."
  );
  return getRandomPlayableVideo(excludeIds);
}
