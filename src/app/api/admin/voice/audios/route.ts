import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || !session.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const audios = await prisma.cardVoiceAudio.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
      include: {
        card: {
          select: { title: true }
        }
      }
    });
    return NextResponse.json(audios);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
