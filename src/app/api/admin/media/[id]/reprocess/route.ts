import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { r2Client } from "@/lib/r2";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

async function originalExists(asset: { bucket: string | null; storage_key: string }) {
  if (asset.bucket && r2Client) {
    try {
      await r2Client.send(new HeadObjectCommand({ Bucket: asset.bucket, Key: asset.storage_key }));
      return true;
    } catch {
      return false;
    }
  }

  const localPath = path.join(process.cwd(), "public", "uploads", asset.storage_key);
  return fs.existsSync(localPath);
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });

    if (!asset || asset.type !== "VIDEO") {
      return NextResponse.json({ error: "Video nao encontrado" }, { status: 404 });
    }

    if (!(await originalExists(asset))) {
      const updated = await prisma.mediaAsset.update({
        where: { id },
        data: {
          processing_status: "ERROR",
          processing_error: "Arquivo original nao encontrado.",
          processing_finished_at: new Date(),
          processing_owner: null,
        },
      });
      return NextResponse.json({ error: "Arquivo original nao encontrado.", asset: updated }, { status: 409 });
    }

    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: {
        processing_status: "QUEUED",
        processing_error: null,
        hls_master_key: null,
        thumbnail_key: null,
        duration_seconds: null,
        processing_started_at: null,
        processing_heartbeat_at: null,
        processing_finished_at: null,
        processing_owner: null,
      },
    });

    return NextResponse.json({ success: true, asset: updated });
  } catch (error) {
    console.error("Error reprocessing media:", error);
    return NextResponse.json({ error: "Failed to reprocess media" }, { status: 500 });
  }
}
