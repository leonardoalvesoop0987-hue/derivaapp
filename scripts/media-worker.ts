import { config } from "dotenv";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient, type MediaAsset } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";
import { pipeline } from "stream/promises";

config({ path: path.resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const r2Client = process.env.R2_ACCOUNT_ID ? new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
}) : null;

const VIDEOS_BUCKET = process.env.R2_VIDEOS_BUCKET || "videos";
const WORKER_ID = `${os.hostname()}-${process.pid}`;
const HEARTBEAT_INTERVAL_MS = 60_000;
const STALE_HEARTBEAT_MINUTES = 30;
const FFMPEG_TIMEOUT_MS = 90 * 60_000;
const FFPROBE_TIMEOUT_MS = 5 * 60_000; // 5 minutes for metadata detection
const R2_TIMEOUT_MS = 10 * 60_000; // 10 minutes for R2 upload/download
const POLL_INTERVAL_MS = 10_000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function truncateError(value: string, max = 1800) {
  return value.length > max ? value.slice(-max) : value;
}

async function downloadFromR2(bucket: string, key: string, destPath: string) {
  if (!r2Client) throw new Error("R2Client not configured");
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await r2Client.send(command);
  if (!response.Body) throw new Error("Empty body from R2");
  await pipeline(response.Body as NodeJS.ReadableStream, fs.createWriteStream(destPath));
}

async function uploadFileToR2(filePath: string, bucket: string, key: string, mimeType: string) {
  if (!r2Client) throw new Error("R2Client not configured");
  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileStream,
    ContentType: mimeType,
  });
  await r2Client.send(command);
}

async function uploadDirToR2(dirPath: string, bucket: string, baseKey: string) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await uploadDirToR2(fullPath, bucket, `${baseKey}/${file}`);
    } else {
      let mime = "application/octet-stream";
      if (file.endsWith(".m3u8")) mime = "application/vnd.apple.mpegurl";
      if (file.endsWith(".ts")) mime = "video/MP2T";
      if (file.endsWith(".jpg")) mime = "image/jpeg";
      await uploadFileToR2(fullPath, bucket, `${baseKey}/${file}`, mime);
    }
  }
}

function runCommand(command: string, args: string[], timeoutMs = FFMPEG_TIMEOUT_MS): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`${command} excedeu o tempo limite. ${truncateError(stderr)}`));
    }, timeoutMs);

    child.stdout.on("data", chunk => { stdout += chunk.toString(); });
    child.stderr.on("data", chunk => { stderr += chunk.toString(); });
    child.on("error", error => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", code => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${command} saiu com cÃ³digo ${code}. ${truncateError(stderr)}`));
      }
    });
  });
}

async function getVideoHeight(filePath: string): Promise<number> {
  try {
    const { stdout } = await runCommand("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=height",
      "-of", "csv=s=x:p=0",
      filePath,
    ], 60_000);
    return parseInt(stdout.trim(), 10) || 720;
  } catch {
    return 720;
  }
}

async function getVideoDuration(filePath: string): Promise<number> {
  try {
    const { stdout } = await runCommand("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      filePath,
    ], 60_000);
    return parseFloat(stdout.trim()) || 0;
  } catch {
    return 0;
  }
}

async function recoverStaleProcessing() {
  const result = await prisma.$executeRaw`
    UPDATE media_assets
    SET
      processing_status = 'QUEUED'::"MediaProcessingStatus",
      processing_error = 'Recuperado automaticamente: processamento sem heartbeat ativo.',
      processing_started_at = NULL,
      processing_heartbeat_at = NULL,
      processing_finished_at = NULL,
      processing_owner = NULL,
      updated_at = NOW()
    WHERE type = 'VIDEO'::"MediaType"
      AND processing_status = 'PROCESSING'::"MediaProcessingStatus"
      AND (
        processing_heartbeat_at IS NULL
        OR processing_heartbeat_at < NOW() - (${STALE_HEARTBEAT_MINUTES} || ' minutes')::interval
      )
  `;
  if (result > 0) {
    console.log(`[MediaWorker] Requeued ${result} stale PROCESSING video(s).`);
  }
}

async function claimNextVideo(): Promise<MediaAsset | null> {
  const rows = await prisma.$queryRaw<MediaAsset[]>`
    UPDATE media_assets
    SET
      processing_status = 'PROCESSING'::"MediaProcessingStatus",
      processing_error = NULL,
      processing_started_at = NOW(),
      processing_heartbeat_at = NOW(),
      processing_finished_at = NULL,
      processing_owner = ${WORKER_ID},
      updated_at = NOW()
    WHERE id = (
      SELECT id
      FROM media_assets
      WHERE type = 'VIDEO'::"MediaType"
        AND processing_status = 'QUEUED'::"MediaProcessingStatus"
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING *
  `;
  return rows[0] ?? null;
}

function startHeartbeat(assetId: string) {
  return setInterval(() => {
    prisma.mediaAsset.updateMany({
      where: {
        id: assetId,
        processing_owner: WORKER_ID,
        processing_status: "PROCESSING",
      },
      data: { processing_heartbeat_at: new Date() },
    }).catch(error => {
      console.error(`[MediaWorker] Heartbeat failed for ${assetId}:`, error);
    });
  }, HEARTBEAT_INTERVAL_MS);
}

async function processVideo(asset: MediaAsset) {
  const filename = asset.original_filename ?? asset.internal_label ?? "unnamed";
  const sizeMB = (asset.size_bytes / 1024 / 1024).toFixed(1);
  console.log(`[MediaWorker] START: ${asset.id} | ${filename} | ${sizeMB}MB`);

  const heartbeat = startHeartbeat(asset.id);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `deriva-media-${asset.id}-`));
  const rawFilePath = path.join(tempDir, "raw.mp4");
  const hlsDir = path.join(tempDir, "hls");
  const thumbPath = path.join(tempDir, "thumb.jpg");
  const baseKey = `hls/${asset.id}`;

  try {
    fs.mkdirSync(hlsDir, { recursive: true });

    // LOCAL STORAGE: Skip R2, load from local disk (much faster)
    const localPath = path.join(process.cwd(), "public", "uploads", asset.storage_key);
    if (!fs.existsSync(localPath)) {
      throw new Error(`Original file not found: ${localPath}`);
    }
    fs.copyFileSync(localPath, rawFilePath);

    const duration = await getVideoDuration(rawFilePath);

    // Generate thumbnail with validation
    try {
      await runCommand("ffmpeg", [
        "-y",
        "-i", rawFilePath,
        "-ss", "00:00:01.000",
        "-vframes", "1",
        thumbPath,
      ]);

      if (!fs.existsSync(thumbPath)) {
        console.warn(`[MediaWorker] Thumbnail not created, using placeholder`);
        // 1x1 pixel transparent PNG placeholder
        const placeholderPng = Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          'base64'
        );
        fs.writeFileSync(thumbPath, placeholderPng);
      }
    } catch (error) {
      console.error(`[MediaWorker] Thumbnail generation failed:`, error instanceof Error ? error.message : error);
      // Create placeholder instead of failing entire process
      const placeholderPng = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(thumbPath, placeholderPng);
    }

    const height = await getVideoHeight(rawFilePath);
    const variants = [];
    // Optimized for faster processing: removed 1080p variant (saves 30-40% of FFmpeg time)
    // 720p is sufficient for mobile/web playback
    if (height >= 720) variants.push({ bitrate: "1800k", name: "720p", height: "720" });
    variants.push({ bitrate: "800k", name: "480p", height: "480" });

    variants.forEach(v => fs.mkdirSync(path.join(hlsDir, v.name), { recursive: true }));

    const filterComplex = variants.map((v, i) => `[0:v]scale=-2:${v.height}[v${i}]`).join(";");
    const args = [
      "-y",
      "-i", rawFilePath,
      "-filter_complex", filterComplex,
      "-threads", "1", // Optimize for single-core systems
    ];
    variants.forEach((v, i) => {
      args.push(
        "-map", `[v${i}]`,
        "-map", "0:a?",
        `-c:v:${i}`, "libx264",
        `-preset:v:${i}`, "ultrafast", // Maximum speed for 1-core CPUs (tradeoff: quality)
        `-b:v:${i}`, v.bitrate,
        `-c:a:${i}`, "aac",
        `-b:a:${i}`, "128k",
      );
    });
    args.push(
      "-f", "hls",
      "-hls_time", "10",
      "-hls_playlist_type", "vod",
      "-hls_flags", "independent_segments",
      "-master_pl_name", "master.m3u8",
      "-var_stream_map", variants.map((v, i) => `v:${i},a:${i},name:${v.name}`).join(" "),
      path.join(hlsDir, "%v", "index.m3u8"),
    );

    console.log(`[MediaWorker] Encoding HLS (${variants.length} variants): ${variants.map(v => v.name).join(", ")} [ultrafast preset for single-core]`);
    const encodeStart = Date.now();
    await runCommand("ffmpeg", args);
    console.log(`[MediaWorker] Encoding complete in ${((Date.now() - encodeStart) / 1000).toFixed(1)}s`);

    // LOCAL STORAGE: Save HLS output locally (skip R2 upload for speed)
    const targetDir = path.join(process.cwd(), "public", "uploads", baseKey);
    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(targetDir, { recursive: true });
    fs.cpSync(hlsDir, targetDir, { recursive: true });

    // Copy thumbnail with validation
    if (fs.existsSync(thumbPath)) {
      fs.copyFileSync(thumbPath, path.join(targetDir, "thumb.jpg"));
    } else {
      console.warn(`[MediaWorker] Thumbnail file not found at ${thumbPath}, creating placeholder`);
      const placeholderPng = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(path.join(targetDir, "thumb.jpg"), placeholderPng);
    }

    await prisma.mediaAsset.updateMany({
      where: {
        id: asset.id,
        processing_owner: WORKER_ID,
      },
      data: {
        processing_status: "READY",
        processing_error: null,
        hls_master_key: `${baseKey}/master.m3u8`,
        thumbnail_key: `${baseKey}/thumb.jpg`,
        duration_seconds: Math.floor(duration),
        processing_finished_at: new Date(),
        processing_heartbeat_at: new Date(),
        processing_owner: null,
      },
    });

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[MediaWorker] DONE: ${asset.id} | Total time: ${totalTime}s | Ready for playback`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const errorTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`[MediaWorker] ERROR after ${errorTime}s: ${asset.id} | ${message.substring(0, 200)}`);
    await prisma.mediaAsset.updateMany({
      where: {
        id: asset.id,
        processing_owner: WORKER_ID,
      },
      data: {
        processing_status: "ERROR",
        processing_error: truncateError(message),
        processing_finished_at: new Date(),
        processing_heartbeat_at: new Date(),
        processing_owner: null,
      },
    });
  } finally {
    clearInterval(heartbeat);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function run() {
  console.log(`[MediaWorker] Starting sequential media worker ${WORKER_ID}.`);
  await recoverStaleProcessing();

  while (true) {
    try {
      await recoverStaleProcessing();
      const pendingAsset = await claimNextVideo();
      if (pendingAsset) {
        await processVideo(pendingAsset);
      } else {
        await sleep(POLL_INTERVAL_MS);
      }
    } catch (err) {
      console.error("[MediaWorker] Loop error:", err);
      await sleep(POLL_INTERVAL_MS);
    }
  }
}

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});

run().catch(error => {
  console.error("[MediaWorker] Fatal error:", error);
  process.exit(1);
});
