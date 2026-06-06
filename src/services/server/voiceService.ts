import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT_URL || "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

function generateHash(text: string, voiceId: string, provider: string): string {
  return crypto.createHash("md5").update(`${text}-${voiceId}-${provider}`).digest("hex");
}

async function getExistingAudioUrl(key: string): Promise<string | null> {
  if (!BUCKET_NAME || !PUBLIC_URL) return null;
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    return `${PUBLIC_URL}/${key}`;
  } catch (_e) {
    return null;
  }
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

export async function generateCardAudio(cardId: string, text: string): Promise<{ enabled: boolean; audioUrl?: string; reason?: string }> {
  const isEnabled = process.env.VOICE_TTS_ENABLED === "true";
  if (!isEnabled) {
    return { enabled: false, reason: "VOICE_TTS_DISABLED" };
  }

  const provider = process.env.VOICE_PROVIDER || "ELEVENLABS";
  if (provider !== "ELEVENLABS" && provider !== "elevenlabs") {
    return { enabled: false, reason: "UNSUPPORTED_PROVIDER" };
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    return { enabled: false, reason: "MISSING_CREDENTIALS" };
  }

  const cleanText = text.trim();
  if (!cleanText) {
    return { enabled: false, reason: "EMPTY_TEXT" };
  }

  const hash = generateHash(cleanText, voiceId, provider);
  const key = `voice/cards/${cardId}/${hash}.mp3`;

  const existingUrl = await getExistingAudioUrl(key);
  if (existingUrl) {
    return { enabled: true, audioUrl: existingUrl };
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
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
      console.error("[VoiceService] ElevenLabs API Error:", await response.text());
      return { enabled: false, reason: "VOICE_GENERATION_FAILED" };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedUrl = await uploadAudio(key, buffer);
    
    if (uploadedUrl) {
      return { enabled: true, audioUrl: uploadedUrl };
    }

    // If upload fails but audio was generated, we can't reliably serve it without cache.
    // We could return a base64 string, but that might be huge.
    // For now, if no R2, we consider it a failure.
    return { enabled: false, reason: "CACHE_UPLOAD_FAILED" };

  } catch (e) {
    console.error("[VoiceService] Exception generating audio:", e);
    return { enabled: false, reason: "VOICE_GENERATION_FAILED" };
  }
}
