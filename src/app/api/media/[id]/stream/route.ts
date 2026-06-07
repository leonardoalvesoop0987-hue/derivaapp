import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getSignedMediaUrl } from "@/lib/r2";

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

    // For music files, proxy from R2 with proper CORS headers
    if (asset.type === "MUSIC") {
      let url = asset.public_url;

      if (!url && asset.bucket) {
        // Generate signed URL for R2
        url = await getSignedMediaUrl(asset.bucket, asset.storage_key, 3600);
      }

      if (!url) {
        return NextResponse.json({ error: "Unable to generate media URL" }, { status: 500 });
      }

      try {
        // Fetch the file from R2/source
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "audio/mp3, audio/mpeg, audio/*"
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch from R2: ${response.status}`);
        }

        // Return the audio with proper CORS headers
        const buffer = await response.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Range",
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=86400"
          }
        });
      } catch (fetchError) {
        console.error("[Stream] Failed to fetch from R2:", fetchError);
        return NextResponse.json({ error: "Failed to stream media" }, { status: 500 });
      }
    }

    // For video files, return the HLS URL or signed URL
    if (asset.type === "VIDEO" && asset.processing_status === "READY" && asset.hls_master_key) {
      const publicBaseUrl = process.env.R2_VIDEOS_S3_API;
      if (publicBaseUrl) {
        return NextResponse.json({
          url: `${publicBaseUrl.replace(/\/$/, "")}/${asset.hls_master_key}`,
          type: "HLS"
        });
      }

      const url = await getSignedMediaUrl(asset.bucket, asset.hls_master_key, 3600);
      return NextResponse.json({ url, type: "HLS" });
    }

    return NextResponse.json({ error: "Unsupported media type" }, { status: 400 });
  } catch (error) {
    console.error("[Stream] Error streaming media:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range"
    }
  });
}
