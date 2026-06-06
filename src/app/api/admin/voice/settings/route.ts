import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getVoiceSettings } from "@/services/server/voiceService";
import { encryptString } from "@/lib/crypto";

export async function GET() {
  const session = await getSession();
  if (!session || !session.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await getVoiceSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || !session.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { enabled, provider, playbackMode, apiKey, voiceId } = body;

    const upsertSetting = async (key: string, value: string | null, encrypted: boolean = false) => {
      if (value === null || value === undefined) return;
      
      const data: Record<string, unknown> = { key };
      if (encrypted) {
        if (value.trim() !== "") {
          data.encrypted_value = encryptString(value);
          data.value = null;
        } else {
          return; // Don't overwrite if empty for passwords
        }
      } else {
        data.value = String(value);
        data.encrypted_value = null;
      }

      await prisma.appSetting.upsert({
        where: { key },
        create: data,
        update: data
      });
    };

    await upsertSetting("VOICE_TTS_ENABLED", enabled ? "true" : "false");
    await upsertSetting("VOICE_PROVIDER", provider);
    await upsertSetting("VOICE_PLAYBACK_MODE", playbackMode);
    await upsertSetting("VOICE_ELEVENLABS_VOICE_ID", voiceId);
    
    if (apiKey) {
      await upsertSetting("VOICE_ELEVENLABS_API_KEY", apiKey, true);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
