import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getCardAudioStatus } from "@/services/server/voiceService";

export async function GET(req: Request) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const cardId = searchParams.get("cardId");
  const text = searchParams.get("text");

  if (!cardId || !text) {
    return NextResponse.json({ error: "Missing cardId or text" }, { status: 400 });
  }

  try {
    const result = await getCardAudioStatus(cardId, text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[VoiceStatusRoute] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
