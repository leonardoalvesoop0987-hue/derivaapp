export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

// GET — list user's decks
export async function GET() {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decks = await prisma.deck.findMany({
    where: {
      OR: [
        { owner_user_id: userSession.userId, type: "COUPLE_CUSTOM" },
        { type: { in: ["SYSTEM", "OFFICIAL"] } }
      ],
      is_active: true
    },
    include: { _count: { select: { cards: { where: { is_active: true } } } } },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({ decks });
}

// POST — create deck
const createSchema = z.object({ 
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  cardIds: z.array(z.string()).optional()
});

export async function POST(req: Request) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description, cardIds } = createSchema.parse(await req.json());

    const deck = await prisma.deck.create({
      data: { 
        owner_user_id: userSession.userId, 
        name, 
        description,
        type: "COUPLE_CUSTOM",
        deck_cards: cardIds ? {
          create: cardIds.map((card_id, index) => ({
            card_id,
            position: index,
          }))
        } : undefined
      },
    });

    return NextResponse.json({ deck });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
