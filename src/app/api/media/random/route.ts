import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const videos = await prisma.mediaAsset.findMany({
      where: {
        type: "VIDEO",
        is_active: true,
        processing_status: "READY",
        classification_status: "CLASSIFIED",
        hls_master_key: { not: null },
        video_category: { not: null },
        content_type: { not: null },
      }
    });

    if (videos.length === 0) {
      return NextResponse.json({ error: "Nenhum vídeo disponível" }, { status: 404 });
    }

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    return NextResponse.json({ asset: randomVideo });
  } catch (error) {
    console.error("Random media error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
