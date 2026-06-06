import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getVoiceSettings } from "@/services/server/voiceService";

export async function GET() {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await getVoiceSettings();
    return NextResponse.json({
      enabled: settings.enabled,
      playbackMode: settings.playbackMode,
    });
  } catch (error) {
    console.error("[VoiceSettingsRoute] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
