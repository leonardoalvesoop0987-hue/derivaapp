import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { r2Client, uploadToR2, MUSICS_BUCKET, VIDEOS_BUCKET } from "@/lib/r2";

function titleFromFilename(filename: string) {
  const withoutExtension = filename.replace(/\.[^/.]+$/, "");
  return withoutExtension.replace(/[_-]+/g, " ").trim() || filename;
}

export async function POST(req: Request) {
  const userSession = await getSession();
  if (!userSession?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const formData = await req.formData();
    const files = [
      ...formData.getAll("files").filter((value): value is File => value instanceof File),
      ...formData.getAll("file").filter((value): value is File => value instanceof File),
    ];
    const type = formData.get("type") as string | null;
    const internalLabel = formData.get("internal_label") as string | null;
    const videoCategory = formData.get("video_category") as string | null;
    const contentType = formData.get("content_type") as string | null;
    const musicMood = formData.get("music_mood") as string | null;
    const parsedTags = formData.get("visual_tags") ? JSON.parse(formData.get("visual_tags") as string) : [];

    if (files.length === 0 || !type) {
      return NextResponse.json({ error: "file/files e type sao obrigatorios" }, { status: 400 });
    }

    if (type !== "VIDEO" && type !== "MUSIC") {
      return NextResponse.json({ error: "type deve ser VIDEO ou MUSIC" }, { status: 400 });
    }

    const isClassifiedVideo = type === "VIDEO" && Boolean(videoCategory && contentType);
    const assets = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storageKey = `${Date.now()}_${crypto.randomUUID()}_${sanitizedName}`;
      let publicUrl: string | null = null;
      let bucket: string | null = null;

      if (r2Client) {
        bucket = type === "MUSIC" ? MUSICS_BUCKET : VIDEOS_BUCKET;
        await uploadToR2(buffer, bucket, storageKey, file.type);
      } else {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, storageKey), buffer);
        publicUrl = `/uploads/${storageKey}`;
      }

      const asset = await prisma.mediaAsset.create({
        data: {
          type: type as "VIDEO" | "MUSIC",
          storage_key: storageKey,
          bucket,
          public_url: publicUrl,
          mime_type: file.type,
          size_bytes: file.size,
          internal_label: internalLabel?.trim() || titleFromFilename(file.name),
          original_filename: file.name,
          video_category: isClassifiedVideo ? videoCategory as import("@prisma/client").VideoCategory : null,
          content_type: isClassifiedVideo ? contentType as import("@prisma/client").VideoContentType : null,
          visual_tags: isClassifiedVideo ? parsedTags : [],
          music_mood: type === "MUSIC" ? (musicMood ?? "SENSUAL") as "RELAXANTE" | "SENSUAL" | "INTENSA" : null,
          processing_status: type === "VIDEO" ? "QUEUED" : "READY",
          classification_status: type === "VIDEO" && !isClassifiedVideo ? "PENDING_CLASSIFICATION" : "CLASSIFIED",
          is_active: type === "VIDEO" ? false : true,
        },
      });
      assets.push(asset);
    }

    return NextResponse.json({ asset: assets[0] ?? null, assets, count: assets.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 });
  }
}
