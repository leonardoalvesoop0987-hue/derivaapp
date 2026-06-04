import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

// PATCH — update card (edit or toggle active)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; cardId: string }> }
) {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, cardId } = await params;

  const deck = await prisma.deck.findFirst({ where: { id, owner_user_id: userSession.userId } });
  if (!deck) return NextResponse.json({ error: "Deck não encontrado" }, { status: 404 });

  const schema = z.object({
    title: z.string().min(1).max(200).optional(),
    body: z.string().min(1).optional(),
    category: z.enum(["AZUL", "DERIVA", "ROSA", "ROXO", "VERMELHO", "PRETO"]).optional(),
    intensity: z.enum(["LEVE", "QUENTE", "INTENSO", "PICO"]).optional(),
    is_invertible: z.boolean().optional(),
    requires_video: z.boolean().optional(),
    receiver_rule: z.enum(["NONE", "WOMAN", "MAN", "ANY"]).optional(),
    is_active: z.boolean().optional(),
  });

  try {
    const data = schema.parse(await req.json());
    const card = await prisma.card.update({ where: { id: cardId, deck_id: id }, data });
    return NextResponse.json({ card });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
