import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { generateCardAudio } from "@/services/server/voiceService";

export async function POST(req: Request) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { cardId, text } = await req.json();
    
    if (!cardId || !text) {
      return NextResponse.json({ error: "Missing cardId or text" }, { status: 400 });
    }

    const audioUrl = await generateCardAudio(cardId, text);
    
    if (!audioUrl) {
      return NextResponse.json({ error: "Voice generation disabled or failed" }, { status: 503 });
    }

    return NextResponse.json({ url: audioUrl });
  } catch (error) {
    console.error("[CardVoiceRoute] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
