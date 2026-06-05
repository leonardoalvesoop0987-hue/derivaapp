import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { SessionMode, SessionLength, CardIntensity } from "@prisma/client";
import { generateSessionSequence } from "@/lib/deriva/session-engine";

const INTENSITIES: CardIntensity[] = ["LEVE", "QUENTE", "INTENSO", "PICO"];

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { sessionId, mode } = body; // mode: "SAME" | "LIGHTER" | "HEAVIER"

    const previousSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { cards: true }
    });

    if (!previousSession || previousSession.user_id !== userSession.userId) {
      return NextResponse.json({ error: "Sessão inválida" }, { status: 404 });
    }

    // Determine session_group_id
    const session_group_id = previousSession.session_group_id || previousSession.id;

    // Get shown card ids from all sessions in this group to avoid repeats
    const groupSessions = await prisma.session.findMany({
      where: { session_group_id: session_group_id },
      include: { cards: { where: { status: { in: ["SHOWN", "COMPLETED", "SKIPPED"] } } } }
    });
    
    const shownCardIds: string[] = [];
    previousSession.cards.forEach(c => shownCardIds.push(c.card_id));
    groupSessions.forEach(s => s.cards.forEach(c => shownCardIds.push(c.card_id)));

    // Adjust max intensity
    let maxIntensity = previousSession.max_intensity;
    const currentIndex = INTENSITIES.indexOf(maxIntensity);
    if (mode === "LIGHTER" && currentIndex > 0) {
      maxIntensity = INTENSITIES[currentIndex - 1];
    } else if (mode === "HEAVIER" && currentIndex < INTENSITIES.length - 1) {
      maxIntensity = INTENSITIES[currentIndex + 1];
    }

    const session = await prisma.session.create({
      data: {
        user_id: userSession.userId,
        deck_id: previousSession.deck_id,
        mode: previousSession.mode,
        length: previousSession.length,
        status: "ACTIVE",
        max_intensity: maxIntensity,
        videos_enabled: previousSession.videos_enabled,
        music_enabled: previousSession.music_enabled,
        target_card_count: previousSession.target_card_count,
        current_position: 0,
        session_group_id: session_group_id,
        preferences_json: previousSession.preferences_json
      }
    });

    // Generate sequence, passing shownCardIds so it doesn't repeat
    const sequence = await generateSessionSequence({
      userId: userSession.userId,
      sessionId: session.id,
      deckId: session.deck_id,
      mode: session.mode,
      length: session.length,
      maxIntensity: session.max_intensity,
      videosEnabled: session.videos_enabled,
      targetCardCount: session.target_card_count,
      shownCardIds: Array.from(new Set(shownCardIds)), // Pass to engine
      preferencesJson: session.preferences_json // Pass custom preferences
    });

    if (sequence.length > 0) {
      await prisma.sessionCard.createMany({
        data: sequence.map((seq, index) => ({
          session_id: session.id,
          card_id: seq.card_id,
          position: seq.position,
          status: index === 0 ? "SHOWN" : "QUEUED",
          metadata_json: seq.metadata_json,
        }))
      });

      await prisma.session.update({
        where: { id: session.id },
        data: { last_card_id: sequence[0].card_id }
      });
    }

    // Update previous session with group_id if it didn't have one
    if (!previousSession.session_group_id) {
       await prisma.session.update({
         where: { id: previousSession.id },
         data: { session_group_id: session_group_id }
       });
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao continuar sessão" }, { status: 500 });
  }
}
