import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { generateCardAudio } from "@/services/server/voiceService";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !session.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const text = "A noite começa quando a primeira carta aparece.";
    const result = await generateCardAudio("test-card-001", text);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
