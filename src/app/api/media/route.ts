import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { NextRequest } from "next/server";
import { drawVideoAdvanced } from "@/lib/deriva/video-engine";

export async function GET(req: NextRequest) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const cardId = searchParams.get("cardId");
    const excludeIds = searchParams.get("exclude") ? searchParams.get("exclude")!.split(",") : [];

    if (!type || (type !== "VIDEO" && type !== "MUSIC")) {
      return NextResponse.json({ error: "type deve ser VIDEO ou MUSIC" }, { status: 400 });
    }

    if (type === "VIDEO" && cardId) {
      const advancedAsset = await drawVideoAdvanced(cardId, excludeIds);
      return NextResponse.json({ asset: advancedAsset });
    }

    const where: Record<string, unknown> = {
      type: type as "VIDEO" | "MUSIC",
      is_active: true,
      ...(type === "VIDEO" && category ? { video_category: category } : {}),
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {})
    };

    const assets = await prisma.mediaAsset.findMany({ where, orderBy: { weight: "desc" } });

    if (assets.length === 0) {
      return NextResponse.json({ asset: null });
    }

    // Weighted random selection
    const totalWeight = assets.reduce((sum, a) => sum + a.weight, 0);
    let random = Math.random() * totalWeight;
    let selected = assets[assets.length - 1];
    for (const asset of assets) {
      random -= asset.weight;
      if (random <= 0) { selected = asset; break; }
    }

    return NextResponse.json({ asset: selected });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
