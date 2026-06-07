import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getVoiceSettings } from "@/services/server/voiceService";

export async function POST() {
  const session = await getSession();
  if (!session || !session.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await getVoiceSettings();

    if (!settings.apiKey || !settings.voiceId) {
      return NextResponse.json({ reason: "Chave ou Voice ID ausentes." }, { status: 400 });
    }

    const text = "Deriva pronto. A carta fala, vocês conduzem o resto.";
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${settings.voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": settings.apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.25,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      let reason = `Falha na API: ${response.status}`;
      if (response.status === 401) reason = "Chave inválida ou sem permissão.";
      else if (response.status === 404) reason = "Voice ID inválido.";
      else if (response.status === 429) reason = "Créditos insuficientes ou limite atingido.";
      
      console.error("[VOICE_TEST] ElevenLabs error:", response.status, errBody);
      return NextResponse.json({ reason }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = `data:audio/mpeg;base64,${buffer.toString('base64')}`;

    return NextResponse.json({ success: true, audioUrl: base64Audio });
  } catch (error) {
    console.error("[VOICE_TEST] Error:", error);
    return NextResponse.json({ reason: "Falha ao gerar áudio de teste." }, { status: 500 });
  }
}
