import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

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

    if (asset.processing_status !== "QUEUED" && asset.processing_status !== "PROCESSING") {
      return NextResponse.json({ error: "Video nao esta na fila ou em processamento." }, { status: 400 });
    }

    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: {
        processing_status: "ERROR",
        processing_error: "Cancelado pelo admin.",
        processing_finished_at: new Date(),
        processing_owner: null,
      },
    });

    return NextResponse.json({ success: true, asset: updated });
  } catch (error) {
    console.error("Error cancelling media:", error);
    return NextResponse.json({ error: "Failed to cancel media" }, { status: 500 });
  }
}
