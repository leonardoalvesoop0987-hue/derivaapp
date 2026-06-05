import { PrismaClient } from "@prisma/client";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";
import { promisify } from "util";
import { pipeline } from "stream/promises";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const r2Client = process.env.R2_ACCOUNT_ID ? new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
}) : null;

const VIDEOS_BUCKET = process.env.R2_VIDEOS_BUCKET || "videos";

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

async function getVideoHeight(filePath: string): Promise<number> {
  try {
    const { stdout } = await execAsync(`ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=s=x:p=0 "${filePath}"`);
    return parseInt(stdout.trim(), 10) || 720;
  } catch (err) {
    return 720;
  }
}

async function getVideoDuration(filePath: string): Promise<number> {
  try {
    const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`);
    return parseFloat(stdout.trim()) || 0;
  } catch (err) {
    return 0;
  }
}

async function processVideo(asset: any) {
  console.log(`Processing video: ${asset.id}`);
  
  await prisma.mediaAsset.update({
    where: { id: asset.id },
    data: { processing_status: "PROCESSING" }
  });

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `deriva-media-${asset.id}-`));
  const rawFilePath = path.join(tempDir, "raw.mp4");
  const hlsDir = path.join(tempDir, "hls");
  const thumbPath = path.join(tempDir, "thumb.jpg");
  
  fs.mkdirSync(hlsDir);

  try {
    // 1. Download original
    if (asset.bucket && r2Client) {
      await downloadFromR2(asset.bucket, asset.storage_key, rawFilePath);
    } else {
      // Local fallback
      const localPath = path.join(process.cwd(), "public", "uploads", asset.storage_key);
      fs.copyFileSync(localPath, rawFilePath);
    }

    const duration = await getVideoDuration(rawFilePath);

    // 2. Extract Thumbnail
    await execAsync(`ffmpeg -y -i "${rawFilePath}" -ss 00:00:01.000 -vframes 1 "${thumbPath}"`);

    // 3. Generate HLS
    const height = await getVideoHeight(rawFilePath);
    
    // We will generate multiple variants based on height
    const variants = [];
    if (height >= 1080) variants.push({ resolution: '1920x1080', bitrate: '5000k', name: '1080p' });
    if (height >= 720) variants.push({ resolution: '1280x720', bitrate: '2800k', name: '720p' });
    variants.push({ resolution: '854x480', bitrate: '1400k', name: '480p' });

    let filterComplex = "";
    let mapArgs = "";
    
    variants.forEach((v, i) => {
      filterComplex += `[0:v]scale=-2:${v.resolution.split('x')[1]}[v${i}];`;
      mapArgs += `-map "[v${i}]" -map 0:a? -c:v:${i} libx264 -b:v:${i} ${v.bitrate} -c:a:${i} aac -b:a:${i} 128k `;
    });

    const masterPlaylist = path.join(hlsDir, "master.m3u8");
    
    // Using a single ffmpeg command to output multiple HLS streams and a master playlist
    const streamMap = variants.map((v, i) => `v:${i},a:${i},name:${v.name}`).join(" ");
    
    const ffmpegCmd = `ffmpeg -y -i "${rawFilePath}" -filter_complex "${filterComplex.slice(0, -1)}" ${mapArgs} -f hls -hls_time 10 -hls_playlist_type vod -hls_flags independent_segments -master_pl_name master.m3u8 -var_stream_map "${streamMap}" "${hlsDir}/%v/index.m3u8"`;
    
    // Create variant directories
    variants.forEach(v => fs.mkdirSync(path.join(hlsDir, v.name)));
    
    console.log(`Running FFmpeg for ${asset.id}...`);
    await execAsync(ffmpegCmd);
    console.log(`FFmpeg complete for ${asset.id}`);

    // 4. Upload to R2
    const baseKey = `hls/${asset.id}`;
    
    if (r2Client) {
      await uploadDirToR2(hlsDir, VIDEOS_BUCKET, baseKey);
      await uploadFileToR2(thumbPath, VIDEOS_BUCKET, `${baseKey}/thumb.jpg`, "image/jpeg");
    } else {
      // Local fallback
      const targetDir = path.join(process.cwd(), "public", "uploads", baseKey);
      fs.cpSync(hlsDir, targetDir, { recursive: true });
      fs.copyFileSync(thumbPath, path.join(targetDir, "thumb.jpg"));
    }

    // 5. Update DB
    await prisma.mediaAsset.update({
      where: { id: asset.id },
      data: {
        processing_status: "READY",
        hls_master_key: `${baseKey}/master.m3u8`,
        thumbnail_key: `${baseKey}/thumb.jpg`,
        duration_seconds: Math.floor(duration),
      }
    });

  } catch (error) {
    console.error(`Error processing ${asset.id}:`, error);
    await prisma.mediaAsset.update({
      where: { id: asset.id },
      data: { processing_status: "ERROR" }
    });
  } finally {
    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function run() {
  console.log("Starting Media Worker...");
  while (true) {
    try {
      const pendingAsset = await prisma.mediaAsset.findFirst({
        where: { type: "VIDEO", processing_status: "UPLOADED" },
        orderBy: { created_at: "asc" }
      });

      if (pendingAsset) {
        await processVideo(pendingAsset);
      } else {
        // Sleep for 10 seconds if no work
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    } catch (err) {
      console.error("Worker error:", err);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}

run();
