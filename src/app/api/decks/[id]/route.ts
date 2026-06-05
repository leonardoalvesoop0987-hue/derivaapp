import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const deck = await prisma.deck.findFirst({
    where: {
      id,
      OR: [
        { owner_user_id: userSession.userId },
        { type: { in: ["SYSTEM", "OFFICIAL"] } }
      ]
    }
  });

  if (!deck) return NextResponse.json({ error: "Deck não encontrado" }, { status: 404 });

  let cards = [];
  if (deck.type === "COUPLE_CUSTOM") {
    // Buscar via deck_cards
    const deckCards = await prisma.deckCard.findMany({
      where: { deck_id: id, is_active: true },
      include: { card: true },
      orderBy: { position: "asc" }
    });
    cards = deckCards.map(dc => dc.card);
  } else {
    // Buscar direto (SYSTEM, OFFICIAL)
    cards = await prisma.card.findMany({
      where: { deck_id: id, is_active: true },
      orderBy: { position: "asc" },
    });
  }

  return NextResponse.json({ deck, cards });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const deck = await prisma.deck.findFirst({ where: { id, owner_user_id: userSession.userId } });
  if (!deck) return NextResponse.json({ error: "Deck não encontrado" }, { status: 404 });

  const schema = z.object({ 
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    cardIds: z.array(z.string()).optional()
  });

  const parsed = schema.parse(await req.json());
  
  // Se veio cardIds, atualiza a seleção
  if (parsed.cardIds) {
    // Deleta seleção anterior
    await prisma.deckCard.deleteMany({ where: { deck_id: id } });
    // Cria nova seleção
    await prisma.deckCard.createMany({
      data: parsed.cardIds.map((card_id, index) => ({
        deck_id: id,
        card_id,
        position: index
      }))
    });
  }

  const updated = await prisma.deck.update({ 
    where: { id }, 
    data: { 
      name: parsed.name,
      description: parsed.description
    } 
  });
  
  return NextResponse.json({ deck: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const deck = await prisma.deck.findFirst({ where: { id, owner_user_id: userSession.userId } });
  if (!deck) return NextResponse.json({ error: "Deck não encontrado" }, { status: 404 });

  await prisma.deck.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
