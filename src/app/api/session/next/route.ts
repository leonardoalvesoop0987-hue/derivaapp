import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getNextCard } from "@/lib/deriva/session-engine";

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId, action } = await req.json();

    const session = await prisma.session.findUnique({
      where: { id: sessionId, user_id: userSession.userId },
      include: { cards: true }
    });

    if (!session) return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
    if (session.status !== "ACTIVE") return NextResponse.json({ error: "Sessão não está ativa" }, { status: 400 });

    let currentCardState = session.last_card_id 
      ? session.cards.find(c => c.card_id === session.last_card_id && c.position === session.current_position)
      : null;

    if (action === "INVERT" && currentCardState) {
      if (session.inversions_used >= 2) return NextResponse.json({ error: "Limite de inversões atingido" }, { status: 400 });
      currentCardState = await prisma.sessionCard.update({
        where: { id: currentCardState.id },
        data: { was_inverted: !currentCardState.was_inverted }
      });
      await prisma.session.update({
        where: { id: sessionId },
        data: { inversions_used: { increment: 1 } }
      });
      
      const currentCard = await prisma.card.findUnique({ where: { id: currentCardState.card_id } });
      return NextResponse.json({ card: currentCard, state: currentCardState, session });
    }

    if (action === "SKIP" && currentCardState) {
      if (session.skips_used >= 2) return NextResponse.json({ error: "Limite de pulos atingido" }, { status: 400 });
      await prisma.sessionCard.update({
        where: { id: currentCardState.id },
        data: { status: "SKIPPED", skipped_at: new Date() }
      });
      await prisma.session.update({
        where: { id: sessionId },
        data: { skips_used: { increment: 1 } }
      });
    } else if (action === "NEXT" && currentCardState) {
      await prisma.sessionCard.update({
        where: { id: currentCardState.id },
        data: { status: "COMPLETED", completed_at: new Date() }
      });
      await prisma.session.update({
        where: { id: sessionId },
        data: { completed_card_count: { increment: 1 } }
      });
    }

    // Check if session is over
    if (action === "NEXT" || action === "SKIP") {
      const isCompleted = session.completed_card_count + 1 >= session.target_card_count;
      if (isCompleted) {
        await prisma.session.update({
          where: { id: sessionId },
          data: { status: "COMPLETED", ended_at: new Date() }
        });
        return NextResponse.json({ completed: true });
      }
    }

    const nextPosition = currentCardState ? session.current_position + 1 : 0;
    
    // Get next card
    const nextCard = await getNextCard({
      userId: session.user_id,
      sessionId: session.id,
      deckId: session.deck_id,
      mode: session.mode,
      length: session.length,
      maxIntensity: session.max_intensity,
      videosEnabled: session.videos_enabled,
      shownCardIds: session.cards.map(c => c.card_id),
      currentPosition: nextPosition,
      targetCardCount: session.target_card_count
    });

    if (!nextCard) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: "COMPLETED", ended_at: new Date() }
      });
      return NextResponse.json({ completed: true, reason: "Sem cartas disponíveis" });
    }

    const newSessionCard = await prisma.sessionCard.create({
      data: {
        session_id: sessionId,
        card_id: nextCard.id,
        position: nextPosition,
        status: "SHOWN"
      }
    });

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { 
        current_position: nextPosition,
        last_card_id: nextCard.id
      }
    });

    return NextResponse.json({ card: nextCard, state: newSessionCard, session: updatedSession });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
