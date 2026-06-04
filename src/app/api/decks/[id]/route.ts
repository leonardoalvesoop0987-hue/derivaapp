import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

const cardSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  category: z.enum(["AZUL", "DERIVA", "ROSA", "ROXO", "VERMELHO", "PRETO"]),
  intensity: z.enum(["LEVE", "QUENTE", "INTENSO", "PICO"]),
  is_invertible: z.boolean().default(false),
  requires_video: z.boolean().default(false),
  receiver_rule: z.enum(["NONE", "WOMAN", "MAN", "ANY"]).default("NONE"),
});

// GET — cards in deck
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const deck = await prisma.deck.findFirst({ where: { id, owner_user_id: userSession.userId } });
  if (!deck) return NextResponse.json({ error: "Deck não encontrado" }, { status: 404 });

  const cards = await prisma.card.findMany({
    where: { deck_id: id },
    orderBy: { position: "asc" },
  });

  return NextResponse.json({ deck, cards });
}

// POST — add card to deck
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const deck = await prisma.deck.findFirst({ where: { id, owner_user_id: userSession.userId } });
  if (!deck) return NextResponse.json({ error: "Deck não encontrado" }, { status: 404 });

  try {
    const data = cardSchema.parse(await req.json());

    if (data.requires_video && data.category !== "ROXO") {
      return NextResponse.json({ error: "Cartas com vídeo devem ser da categoria ROXO" }, { status: 400 });
    }

    const count = await prisma.card.count({ where: { deck_id: id } });

    const card = await prisma.card.create({
      data: { ...data, deck_id: id, position: count + 1 },
    });

    return NextResponse.json({ card });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// PATCH — update deck name
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const deck = await prisma.deck.findFirst({ where: { id, owner_user_id: userSession.userId } });
  if (!deck) return NextResponse.json({ error: "Deck não encontrado" }, { status: 404 });

  const { name } = z.object({ name: z.string().min(1) }).parse(await req.json());
  const updated = await prisma.deck.update({ where: { id }, data: { name } });
  return NextResponse.json({ deck: updated });
}
