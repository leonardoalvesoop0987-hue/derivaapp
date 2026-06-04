import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { SessionMode, SessionLength, CardIntensity } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { mode, length, maxIntensity, videosEnabled, musicEnabled } = body;

    // Get default deck
    const deck = await prisma.deck.findFirst({
      where: { is_default: true, type: 'SYSTEM' }
    });

    if (!deck) {
      return NextResponse.json({ error: "Nenhum deck padrão encontrado" }, { status: 500 });
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
        videos_enabled: videosEnabled,
        music_enabled: musicEnabled,
        target_card_count: targetCardCount,
        current_position: 0,
      }
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar sessão" }, { status: 500 });
  }
}
