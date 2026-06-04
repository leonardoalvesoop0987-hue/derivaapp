import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { r2Client, getSignedMediaUrl } from "@/lib/r2";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset || !asset.is_active) {
      return NextResponse.json({ error: "Media not found or inactive" }, { status: 404 });
    }

    if (r2Client && asset.bucket) {
      // Retorna a URL assinada temporária (válida por 1 hora)
      const url = await getSignedMediaUrl(asset.bucket, asset.storage_key, 3600);
      return NextResponse.json({ url });
    } else if (asset.public_url) {
      // Retorna a URL local
      return NextResponse.json({ url: asset.public_url });
    } else {
      return NextResponse.json({ error: "URL not available" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error generating signed URL", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}
