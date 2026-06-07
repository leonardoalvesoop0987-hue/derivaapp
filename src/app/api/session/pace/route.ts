import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { generateSessionSequence } from "@/lib/deriva/session-engine";
import { CardIntensity, SessionStage } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { sessionId, choice } = body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { cards: { orderBy: { position: "asc" } } }
    });

    if (!session || session.user_id !== userSession.userId) {
      return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
    }

    // 1. Save Pace Event
    await prisma.sessionPaceEvent.create({
      data: {
        session_id: session.id,
        position: session.current_position,
        pace_choice: choice,
      }
    });

    if (choice === "SAME") {
      return NextResponse.json({ success: true, updatedQueuedCards: 0 });
    }

    const queuedCards = session.cards.filter(c => c.status === "QUEUED");
    if (queuedCards.length === 0) {
      return NextResponse.json({ success: true, updatedQueuedCards: 0 });
    }

    // Determine constraints
    let tempMaxIntensity = session.max_intensity;
    let forceStage = undefined;

    if (choice === "SLOWER") {
      tempMaxIntensity = "QUENTE"; // downgrade intensity
    } else if (choice === "FASTER") {
      // Force next card to be intense, if allowed
      if (session.max_intensity === "INTENSO" || session.max_intensity === "PICO") {
        forceStage = "INTENSE";
      }
    }

    const currentPos = session.current_position;
    const remainingCount = session.target_card_count - currentPos;

    if (remainingCount <= 0) {
      return NextResponse.json({ success: true, updatedQueuedCards: 0 });
    }

    // Delete existing QUEUED cards
    await prisma.sessionCard.deleteMany({
      where: {
        session_id: session.id,
        status: "QUEUED"
      }
    });

    // Extract shown card ids (excluding QUEUED)
    const shownCardIds = session.cards.filter(c => c.status !== "QUEUED").map(c => c.card_id);

    // Regenerate
    const sequence = await generateSessionSequence({
      userId: session.user_id,
      sessionId: session.id,
      deckId: session.deck_id,
      mode: session.mode,
      length: session.length,
      maxIntensity: tempMaxIntensity as CardIntensity,
      videosEnabled: session.videos_enabled,
      currentPosition: currentPos,
      targetCardCount: remainingCount,
      fullTargetCardCount: session.target_card_count,
      shownCardIds: shownCardIds,
      preferencesJson: session.preferences_json,
      sessionFocus: session.session_focus,
      forceStage: forceStage as SessionStage | undefined,
    });

    // Save regenerated sequence
    // Note: the position returned by generateSessionSequence starts from 0 relative to targetCardCount loop, but wait!
    // generateSessionSequence uses a loop `for (let pos = 0; pos < input.targetCardCount; pos++)`.
    // It passes actualPos = pos... wait, if targetCardCount is remainingCount, it will start from pos=0!
    // Let's adjust positions before creating.
    for (let i = 0; i < sequence.length; i++) {
      const actualPos = currentPos + i;
      await prisma.sessionCard.create({
        data: {
          session_id: session.id,
          card_id: sequence[i].card_id,
          random_option_id: sequence[i].random_option_id ?? null,
          position: actualPos,
          status: "QUEUED",
          metadata_json: sequence[i].metadata_json
        }
      });
    }

    return NextResponse.json({ success: true, updatedQueuedCards: sequence.length });

  } catch (error) {
    console.error("Pace error:", error);
    return NextResponse.json({ error: "Failed to update pace" }, { status: 500 });
  }
}
