import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { generateSessionSequence } from "@/lib/deriva/session-engine";
// import preloadSessionAudios if possible, but we might just let it be generated on the fly.
// Let's import the voice service directly if needed, or rely on normal page fetch.
import { preloadSessionAudios } from "@/services/server/voiceService";

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { sessionId } = body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { cards: { orderBy: { position: "asc" } } }
    });

    if (!session || session.user_id !== userSession.userId) {
      return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
    }

    const queuedCards = session.cards.filter(c => c.status === "QUEUED");
    
    // Shift positions + 1
    for (const qc of queuedCards) {
      await prisma.sessionCard.update({
        where: { id: qc.id },
        data: { position: qc.position + 1 }
      });
    }

    const shownCardIds = session.cards.map(c => c.card_id);

    // Generate 1 pause card
    const sequence = await generateSessionSequence({
      userId: session.user_id,
      sessionId: session.id,
      deckId: session.deck_id,
      mode: session.mode,
      length: session.length,
      maxIntensity: "LEVE", // Force lighter for pause
      videosEnabled: session.videos_enabled,
      currentPosition: session.current_position,
      targetCardCount: 1,
      fullTargetCardCount: session.target_card_count,
      shownCardIds: shownCardIds,
      preferencesJson: session.preferences_json,
      sessionFocus: session.session_focus,
      forceStage: "COOLDOWN", // Use Cooldown stage for pause
    });

    if (sequence.length > 0) {
      const newCard = await prisma.sessionCard.create({
        data: {
          session_id: session.id,
          card_id: sequence[0].card_id,
          random_option_id: sequence[0].random_option_id ?? null,
          position: session.current_position,
          status: "QUEUED",
          metadata_json: sequence[0].metadata_json,
          is_inserted_pause: true,
          does_not_count_towards_target: true
        }
      });

      // Preload audio for the new card asynchronously
      preloadSessionAudios(session.id).catch(console.error);

      return NextResponse.json({ success: true, insertedCardId: newCard.id });
    }

    return NextResponse.json({ success: false, error: "Não foi possível gerar carta de pausa." });

  } catch (error) {
    console.error("Pause error:", error);
    return NextResponse.json({ error: "Failed to insert pause" }, { status: 500 });
  }
}
