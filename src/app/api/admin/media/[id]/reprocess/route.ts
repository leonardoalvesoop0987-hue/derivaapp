import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const asset = await prisma.mediaAsset.findUnique({
      where: { id }
    });

    if (!asset) {
      return NextResponse.json({ error: "Vídeo não encontrado" }, { status: 404 });
    }

    await prisma.mediaAsset.update({
      where: { id },
      data: {
        processing_status: "UPLOADED",
        processing_error: null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reprocessing media:", error);
    return NextResponse.json({ error: "Failed to reprocess media" }, { status: 500 });
  }
}
