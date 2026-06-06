import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { decryptString } from "@/lib/crypto";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

// We need a specific bucket for voices, maybe default to videos or create voice bucket. 
// Fallback to "videos" if a specific voice bucket is not defined in env.
const BUCKET_NAME = process.env.R2_VOICES_BUCKET || process.env.R2_VIDEOS_BUCKET || "";
const PUBLIC_URL = process.env.R2_VOICES_S3_API || process.env.R2_VIDEOS_S3_API || "";

function generateHash(text: string, voiceId: string, provider: string): string {
  return crypto.createHash("md5").update(`${text}-${voiceId}-${provider}`).digest("hex");
}

export type VoiceSettings = {
  enabled: boolean;
  provider: string;
  playbackMode: string;
  apiKey: string;
  voiceId: string;
};

export async function getVoiceSettings(): Promise<VoiceSettings> {
  // Ler do banco (AppSetting) e fallback para env
  const settings = await prisma.appSetting.findMany({
    where: { key: { startsWith: "VOICE_" } },
  });

  const getVal = (key: string) => settings.find(s => s.key === key)?.value;
  const getEnc = (key: string) => {
    const s = settings.find(s => s.key === key);
    return s?.encrypted_value ? decryptString(s.encrypted_value) : s?.value;
  };

  const enabledVal = getVal("VOICE_TTS_ENABLED") ?? process.env.VOICE_TTS_ENABLED ?? "false";
  const provider = getVal("VOICE_PROVIDER") ?? process.env.VOICE_PROVIDER ?? "elevenlabs";
  const playbackMode = getVal("VOICE_PLAYBACK_MODE") ?? process.env.VOICE_PLAYBACK_MODE ?? "manual";
  
  // API Key in DB might be encrypted
  let apiKey = getEnc("VOICE_ELEVENLABS_API_KEY");
  if (!apiKey || apiKey.trim() === "") {
    apiKey = process.env.ELEVENLABS_API_KEY;
  }

  let voiceId = getVal("VOICE_ELEVENLABS_VOICE_ID");
  if (!voiceId || voiceId.trim() === "") {
    voiceId = process.env.ELEVENLABS_VOICE_ID;
  }

  return {
    enabled: enabledVal === "true",
    provider,
    playbackMode,
    apiKey: apiKey || "",
    voiceId: voiceId || "",
  };
}

async function uploadAudio(key: string, audioBuffer: Buffer): Promise<string | null> {
  if (!BUCKET_NAME || !PUBLIC_URL) {
    console.warn("[VoiceService] No R2 bucket configured. Skipping cache upload.");
    return null;
  }
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: audioBuffer,
        ContentType: "audio/mpeg",
      })
    );
    return `${PUBLIC_URL}/${key}`;
  } catch (e) {
    console.error("[VoiceService] Failed to upload audio to R2:", e);
    return null;
  }
}

export async function generateCardAudio(cardId: string, text: string, sessionCardId?: string): Promise<{ enabled: boolean; audioUrl?: string; reason?: string }> {
  const settings = await getVoiceSettings();

  if (!settings.enabled) {
    return { enabled: false, reason: "VOICE_TTS_DISABLED" };
  }

  if (settings.provider.toLowerCase() !== "elevenlabs") {
    return { enabled: false, reason: "UNSUPPORTED_PROVIDER" };
  }

  if (!settings.apiKey || !settings.voiceId) {
    return { enabled: false, reason: "MISSING_CREDENTIALS" };
  }

  const cleanText = text.trim();
  if (!cleanText) {
    return { enabled: false, reason: "EMPTY_TEXT" };
  }

  const hash = generateHash(cleanText, settings.voiceId, settings.provider);

  // Check DB cache
  const existingRecord = await prisma.cardVoiceAudio.findFirst({
    where: {
      provider: settings.provider,
      voice_id: settings.voiceId,
      card_id: cardId,
      text_hash: hash,
    }
  });

  if (existingRecord) {
    if (existingRecord.status === "READY" && existingRecord.audio_url) {
      return { enabled: true, audioUrl: existingRecord.audio_url };
    }
    if (existingRecord.status === "GENERATING" || existingRecord.status === "PENDING") {
      // In a real job queue, we'd wait. Here we'll just fail fast to not block UI if it takes long.
      return { enabled: false, reason: "AUDIO_IS_GENERATING" };
    }
  }

  // Record doesn't exist or failed. Create/update to GENERATING.
  const r2Key = `voice/cards/${cardId}/${settings.voiceId}/${hash}.mp3`;

  const record = await prisma.cardVoiceAudio.upsert({
    where: {
      provider_voice_id_card_id_text_hash: {
        provider: settings.provider,
        voice_id: settings.voiceId,
        card_id: cardId,
        text_hash: hash,
      }
    },
    create: {
      card_id: cardId,
      session_card_id: sessionCardId,
      provider: settings.provider,
      voice_id: settings.voiceId,
      text_hash: hash,
      text_used: cleanText,
      r2_key: r2Key,
      status: "GENERATING"
    },
    update: {
      status: "GENERATING",
      error_message: null
    }
  });

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${settings.voiceId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": settings.apiKey,
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[VoiceService] ElevenLabs API Error:", errorText);
      await prisma.cardVoiceAudio.update({
        where: { id: record.id },
        data: { status: "ERROR", error_message: "ElevenLabs API Error" }
      });
      return { enabled: false, reason: "VOICE_GENERATION_FAILED" };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedUrl = await uploadAudio(r2Key, buffer);
    
    if (uploadedUrl) {
      await prisma.cardVoiceAudio.update({
        where: { id: record.id },
        data: { status: "READY", audio_url: uploadedUrl }
      });
      return { enabled: true, audioUrl: uploadedUrl };
    }

    await prisma.cardVoiceAudio.update({
      where: { id: record.id },
      data: { status: "ERROR", error_message: "Upload to R2 Failed" }
    });
    return { enabled: false, reason: "CACHE_UPLOAD_FAILED" };

  } catch (e: unknown) {
    console.error("[VoiceService] Exception generating audio:", e);
    await prisma.cardVoiceAudio.update({
      where: { id: record.id },
      data: { status: "ERROR", error_message: (e as Error).message || "Exception" }
    });
    return { enabled: false, reason: "VOICE_GENERATION_FAILED" };
  }
}

// Background task to preload audios for a session
export async function preloadSessionAudios(sessionId: string) {
  try {
    console.log(`[VoiceService] Preloading audios for session ${sessionId}...`);
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        cards: {
          include: { card: true },
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!session) return;

    for (const sc of session.cards) {
      if (sc.card.category === "ROXO" || sc.card.category === "VERMELHO") continue; // Exemplos, ou tenta todas
      
      const textToRead = sc.card.session_short_text?.trim();

      if (textToRead) {
        // Will generate and cache if not exists, skip if exists
        await generateCardAudio(sc.card.id, textToRead, sc.id);
      }
    }
    console.log(`[VoiceService] Preload completed for session ${sessionId}.`);
  } catch (e) {
    console.error("[VoiceService] Preload failed:", e);
  }
}
