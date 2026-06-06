import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

// AWS S3 / Cloudflare R2 Client (Reuse from existing setup or create a basic one)
// Assuming we use standard environment variables for R2
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

/**
 * Checks if the generated audio already exists in R2
 */
async function getExistingAudioUrl(cardId: string): Promise<string | null> {
  const key = `voice/cards/${cardId}.mp3`;
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    return `${PUBLIC_URL}/${key}`;
  } catch (e) {
    return null; // Not found
  }
}

/**
 * Uploads an audio buffer to R2 and returns its public URL
 */
async function uploadAudio(cardId: string, audioBuffer: Buffer): Promise<string | null> {
  if (!BUCKET_NAME || !PUBLIC_URL) return null;
  const key = `voice/cards/${cardId}.mp3`;
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
    console.error("Failed to upload audio to R2:", e);
    return null;
  }
}

/**
 * Generates audio for a given text using ElevenLabs API
 */
export async function generateCardAudio(cardId: string, text: string): Promise<string | null> {
  const isEnabled = process.env.VOICE_TTS_ENABLED === "true";
  if (!isEnabled) {
    console.log("[VoiceService] TTS is globally disabled.");
    return null;
  }

  const provider = process.env.VOICE_PROVIDER || "ELEVENLABS";
  if (provider !== "ELEVENLABS") {
    console.log(`[VoiceService] Unsupported provider: ${provider}`);
    return null;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    console.log("[VoiceService] Missing ElevenLabs credentials.");
    return null;
  }

  // 1. Check if it already exists
  const existingUrl = await getExistingAudioUrl(cardId);
  if (existingUrl) {
    return existingUrl;
  }

  // 2. Generate with ElevenLabs
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
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      console.error("[VoiceService] ElevenLabs API Error:", await response.text());
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload to R2
    const uploadedUrl = await uploadAudio(cardId, buffer);
    return uploadedUrl;

  } catch (e) {
    console.error("[VoiceService] Exception generating audio:", e);
    return null;
  }
}
