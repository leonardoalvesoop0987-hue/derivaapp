import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { generateCardAudio } from "@/services/server/voiceService";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !session.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { cardId } = await req.json();
    if (!cardId) return NextResponse.json({ error: "Missing cardId" }, { status: 400 });

    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

    const textToRead = card.session_short_text?.trim();

    if (!textToRead) {
      return NextResponse.json({ enabled: false, reason: "SHORT_TEXT_MISSING" });
    }

    const result = await generateCardAudio(cardId, textToRead);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
