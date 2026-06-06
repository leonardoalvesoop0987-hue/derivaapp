import crypto from "crypto";

// Fallback key if not provided in .env (for dev/local). 
// In production, MUST use APP_CONFIG_ENCRYPTION_KEY in .env
const ENCRYPTION_KEY = process.env.APP_CONFIG_ENCRYPTION_KEY || "deriva_fallback_secret_key_32bytes".padEnd(32, '0').slice(0, 32);
const ALGORITHM = "aes-256-cbc";

export function encryptString(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptString(text: string): string | null {
  try {
    const textParts = text.split(":");
    const ivHex = textParts.shift();
    if (!ivHex) return null;
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.error("[Crypto] Decryption error", err);
    return null;
  }
}
