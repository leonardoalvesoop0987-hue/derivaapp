import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { r2Client, getSignedMediaUrl } from "@/lib/r2";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });

    if (!asset || !asset.is_active) {
      return NextResponse.json({ error: "Media not found or inactive" }, { status: 404 });
    }

    const key =
      asset.type === "VIDEO" && asset.processing_status === "READY" && asset.hls_master_key
        ? asset.hls_master_key
        : asset.storage_key;

    const publicBaseUrl = asset.type === "VIDEO" ? process.env.R2_VIDEOS_S3_API : process.env.R2_MUSICS_S3_API;
    if (asset.bucket && publicBaseUrl) {
      return NextResponse.json({ url: `${publicBaseUrl.replace(/\/$/, "")}/${key}` });
    }

    if (r2Client && asset.bucket) {
      const url = await getSignedMediaUrl(asset.bucket, key, 3600);
      return NextResponse.json({ url });
    }

    if (asset.public_url) {
      return NextResponse.json({ url: key === asset.storage_key ? asset.public_url : `/uploads/${key}` });
    }

    return NextResponse.json({ error: "URL not available" }, { status: 500 });
  } catch (error) {
    console.error("Error generating media URL", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}
