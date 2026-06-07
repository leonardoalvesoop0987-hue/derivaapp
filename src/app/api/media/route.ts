import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { NextRequest } from "next/server";
import { getRandomPlayableVideo } from "@/lib/deriva/video-engine";

export async function GET(req: NextRequest) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");
    const excludeIds = searchParams.get("exclude") ? searchParams.get("exclude")!.split(",") : [];

    if (!type || (type !== "VIDEO" && type !== "MUSIC")) {
      return NextResponse.json({ error: "type deve ser VIDEO ou MUSIC" }, { status: 400 });
    }

    if (type === "VIDEO") {
      // VIDEO: Use simplified random draw (no weights, no classification required)
      const asset = await getRandomPlayableVideo(excludeIds);
      return NextResponse.json({ asset });
    }

    // MUSIC: Simple active selection with random pick
    const musicAssets = await prisma.mediaAsset.findMany({
      where: {
        type: "MUSIC",
        is_active: true,
        ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {})
      }
    });

    if (musicAssets.length === 0) {
      return NextResponse.json({ asset: null });
    }

    const selected = musicAssets[Math.floor(Math.random() * musicAssets.length)];
    return NextResponse.json({ asset: selected });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
