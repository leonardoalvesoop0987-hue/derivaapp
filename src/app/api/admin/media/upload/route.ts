import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { r2Client, uploadToR2, MUSICS_BUCKET, VIDEOS_BUCKET } from "@/lib/r2";

export async function POST(req: Request) {
  const userSession = await getSession();
  if (!userSession?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const internal_label = formData.get("internal_label") as string | null;
    const video_category = formData.get("video_category") as string | null;
    const music_mood = formData.get("music_mood") as string | null;

    if (!file || !type) {
      return NextResponse.json({ error: "file e type são obrigatórios" }, { status: 400 });
    }

    if (type !== "VIDEO" && type !== "MUSIC") {
      return NextResponse.json({ error: "type deve ser VIDEO ou MUSIC" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storage_key = `${Date.now()}_${sanitizedName}`;
    
    let public_url: string | null = null;
    let bucket: string | null = null;

    if (r2Client) {
      // Upload via R2
      bucket = type === "MUSIC" ? MUSICS_BUCKET : VIDEOS_BUCKET;
      await uploadToR2(buffer, bucket, storage_key, file.type);
      // public_url is not set for R2 private buckets, signed URLs are used
    } else {
      // Upload Local
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, storage_key), buffer);
      public_url = `/uploads/${storage_key}`;
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        type: type as "VIDEO" | "MUSIC",
        storage_key,
        bucket,
        public_url,
        mime_type: file.type,
        size_bytes: file.size,
        internal_label: internal_label ?? sanitizedName,
        original_filename: file.name,
        video_category: type === "VIDEO" && video_category ? video_category as any : null,
        content_type: type === "VIDEO" && formData.get("content_type") ? formData.get("content_type") as any : null,
        visual_tags: formData.get("visual_tags") ? JSON.parse(formData.get("visual_tags") as string) : [],
        music_mood: type === "MUSIC" ? (music_mood ?? "SENSUAL") as any : null,
        processing_status: type === "VIDEO" ? "UPLOADED" : "READY",
      },
    });

    return NextResponse.json({ asset });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 });
  }
}
