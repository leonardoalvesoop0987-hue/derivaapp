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

    const session = await prisma.session.findUnique({
      where: { id: id },
      select: { session_group_id: true, id: true }
    });

    if (!session) return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });

    const groupId = session.session_group_id || session.id;

    const sessionCards = await prisma.sessionCard.findMany({
      where: { session: { session_group_id: groupId } },
      include: { card: true },
      orderBy: [
        { session: { created_at: "asc" } },
        { position: "asc" }
      ],
    });

    // Fallback if the group search fails for some reason or returns none (for legacy sessions without group_id)
    if (sessionCards.length === 0) {
       const legacyCards = await prisma.sessionCard.findMany({
         where: { session_id: id },
         include: { card: true },
         orderBy: { position: "asc" },
       });
       sessionCards.push(...legacyCards);
    }

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
