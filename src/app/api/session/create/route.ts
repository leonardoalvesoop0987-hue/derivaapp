import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { SessionMode, SessionLength, CardIntensity } from "@prisma/client";
import { generateSessionSequence } from "@/lib/deriva/session-engine";

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { mode, length, maxIntensity, musicEnabled, preferencesJson, deckId } = body;

    let deck;
    if (deckId) {
      deck = await prisma.deck.findUnique({ where: { id: deckId } });
      if (!deck) return NextResponse.json({ error: "Deck não encontrado" }, { status: 404 });

      if (deck.requires_couple_unlock && deck.unlock_group_key) {
        const unlock = await prisma.coupleUnlock.findUnique({
          where: {
            user_id_unlock_group_key: {
              user_id: userSession.userId,
              unlock_group_key: deck.unlock_group_key
            }
          }
        });
        if (!unlock || !unlock.is_enabled) {
          return NextResponse.json({ error: "Deck bloqueado. Desbloqueie nas configurações." }, { status: 403 });
        }
      }
    } else {
      deck = await prisma.deck.findFirst({
        where: { is_default: true, type: 'SYSTEM' }
      });
      if (!deck) return NextResponse.json({ error: "Nenhum deck padrão encontrado" }, { status: 500 });
    }

    let targetCardCount = 10;
    if (length === "CURTA") targetCardCount = 6;
    if (length === "COMPLETA") targetCardCount = 14;

    const session = await prisma.session.create({
      data: {
        user_id: userSession.userId,
        deck_id: deck.id,
        mode: mode as SessionMode,
        length: length as SessionLength,
        status: "ACTIVE",
        max_intensity: maxIntensity as CardIntensity,
        videos_enabled: true, // videos always enabled now
        music_enabled: musicEnabled,
        target_card_count: targetCardCount,
        current_position: 0,
        preferences_json: preferencesJson
      }
    });

    // Generate sequence
    const sequence = await generateSessionSequence({
      userId: userSession.userId,
      sessionId: session.id,
      deckId: deck.id,
      mode: session.mode,
      length: session.length,
      maxIntensity: session.max_intensity,
      videosEnabled: true,
      targetCardCount: session.target_card_count,
      preferencesJson: session.preferences_json
    });

    if (sequence.length > 0) {
      // Create session cards with QUEUED status (except first one which is SHOWN)
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

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar sessão" }, { status: 500 });
  }
}
