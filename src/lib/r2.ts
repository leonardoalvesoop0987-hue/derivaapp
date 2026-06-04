import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`;

// Initialize S3 Client only if credentials are provided
export const r2Client = (accountId && accessKeyId && secretAccessKey) 
  ? new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

export const MUSICS_BUCKET = process.env.R2_MUSICS_BUCKET || "musicas";
export const VIDEOS_BUCKET = process.env.R2_VIDEOS_BUCKET || "videos";

/**
 * Upload a file buffer to Cloudflare R2
 */
export async function uploadToR2(
  buffer: Buffer, 
  bucket: string, 
  key: string, 
  mimeType: string
) {
  if (!r2Client) throw new Error("R2 Client is not configured. Check environment variables.");
  
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  return r2Client.send(command);
}

/**
 * Generate a signed URL for reading a private object in R2
 */
export async function getSignedMediaUrl(bucket: string, key: string, expiresInSeconds = 3600) {
  if (!r2Client) throw new Error("R2 Client is not configured.");
  
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}
