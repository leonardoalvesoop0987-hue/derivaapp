import { NextResponse } from "next/server";
import { generateSessionSequence } from "@/lib/deriva/session-engine";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, length, maxIntensity, videosEnabled } = body;

    // Default target count
    let targetCardCount = 30;
    if (length === "CURTA") targetCardCount = 15;
    if (length === "COMPLETA") targetCardCount = 50;

    // We need a dummy deckId (the default system deck)
    const deck = await prisma.deck.findFirst({
      where: { is_default: true, type: "SYSTEM" }
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck padrão não encontrado" }, { status: 404 });
    }

    // Run the engine for a generic user
    const sequence = await generateSessionSequence({
      userId: "SIMULATION_USER",
      sessionId: "SIMULATION_SESSION",
      deckId: deck.id,
      mode: mode || "PADRAO",
      length: length || "MEDIA",
      maxIntensity: maxIntensity || "INTENSO",
      videosEnabled: !!videosEnabled,
      shownCardIds: [],
      currentPosition: 0,
      targetCardCount,
      preferencesJson: null,
    });

    // Populate card details
    const populated = await Promise.all(
      sequence.map(async (s) => {
        const c = await prisma.card.findUnique({ where: { id: s.card_id }});
        return {
          position: s.position + 1,
          id: c?.id,
          title: c?.title,
          category: c?.category,
          intensity: c?.intensity,
          stage: c?.stage,
          primary_tag: c?.primary_tag,
          unlock_group_key: c?.unlock_group_key
        };
      })
    );

    return NextResponse.json({ sequence: populated });
  } catch (error: any) {
    console.error("Simulation error:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
