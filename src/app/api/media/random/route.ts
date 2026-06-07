import { NextResponse } from "next/server";
import { getRandomPlayableVideo } from "@/lib/deriva/video-engine";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const asset = await getRandomPlayableVideo();
    return NextResponse.json({ asset });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
