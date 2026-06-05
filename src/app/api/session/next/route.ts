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
      
      let meta = currentCardState.metadata_json ? JSON.parse(currentCardState.metadata_json) : {};
      
      currentCardState = await prisma.sessionCard.update({
        where: { id: currentCardState.id },
        data: { 
          was_inverted: !currentCardState.was_inverted,
          metadata_json: JSON.stringify({
             ...meta,
             current_receiver: meta.current_receiver === "MAN" ? "WOMAN" : meta.current_receiver === "WOMAN" ? "MAN" : "ANY"
          })
        }
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
        data: { skips_used: { increment: 1 }, target_card_count: { increment: 1 } } // Increment target so we play one more
      });

      // Draw a new substitute card and queue it at the end
      const lastCard = session.cards[session.cards.length - 1];
      const nextPos = lastCard ? lastCard.position + 1 : session.current_position + 1;
      
      const { generateSessionSequence } = await import("@/lib/deriva/session-engine");
      const substitute = await generateSessionSequence({
        userId: session.user_id,
        sessionId: session.id,
        deckId: session.deck_id,
        mode: session.mode,
        length: session.length,
        maxIntensity: session.max_intensity,
        videosEnabled: true,
        targetCardCount: 1, // Draw just 1
      });

      if (substitute.length > 0) {
        await prisma.sessionCard.create({
          data: {
            session_id: sessionId,
            card_id: substitute[0].card_id,
            position: nextPos,
            status: "QUEUED",
            metadata_json: substitute[0].metadata_json,
          }
        });
      }

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

    // Refresh session to get updated counts and newly inserted cards
    const updatedSessionData = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { cards: true }
    });

    const isCompleted = updatedSessionData!.completed_card_count >= updatedSessionData!.target_card_count;
    if (isCompleted && action !== "INVERT") {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: "COMPLETED", ended_at: new Date() }
      });
      return NextResponse.json({ completed: true });
    }

    const nextPosition = currentCardState ? session.current_position + 1 : 0;
    
    // Get next QUEUED card
    let nextSessionCard = updatedSessionData!.cards.find(c => c.position === nextPosition && c.status === "QUEUED");

    if (!nextSessionCard) {
      // Fallback if queue is empty
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: "COMPLETED", ended_at: new Date() }
      });
      return NextResponse.json({ completed: true, reason: "Sem cartas disponíveis" });
    }

    // Mark as SHOWN
    nextSessionCard = await prisma.sessionCard.update({
      where: { id: nextSessionCard.id },
      data: { status: "SHOWN", shown_at: new Date() }
    });

    const nextCard = await prisma.card.findUnique({ where: { id: nextSessionCard.card_id } });

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { 
        current_position: nextPosition,
        last_card_id: nextCard!.id
      }
    });

    return NextResponse.json({ card: nextCard, state: nextSessionCard, session: updatedSession });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
