import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const sessionCards = await prisma.sessionCard.findMany({
      where: { session_id: id },
      include: { card: true },
      orderBy: { position: "asc" },
    });

    const cards = sessionCards.map((sc) => ({
      card_id: sc.card_id,
      position: sc.position,
      status: sc.status,
      was_inverted: sc.was_inverted,
      card: {
        id: sc.card.id,
        title: sc.card.title,
        category: sc.card.category,
        intensity: sc.card.intensity,
        body: sc.card.body,
      },
    }));

    return NextResponse.json({ cards });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
