export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

const patchSchema = z.object({
  is_active: z.boolean().optional(),
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  category: z.enum(["AZUL","DERIVA","ROSA","ROXO","VERMELHO","PRETO"]).optional(),
  intensity: z.enum(["LEVE","QUENTE","INTENSO","PICO"]).optional(),
  is_invertible: z.boolean().optional(),
  requires_video: z.boolean().optional(),
  receiver_rule: z.enum(["NONE","WOMAN","MAN","ANY"]).optional(),
  primary_tag: z.string().nullable().optional(),
  secondary_tags: z.array(z.string()).optional(),
  stage: z.string().nullable().optional(),
  erotic_function: z.string().nullable().optional(),
  body_focus: z.string().nullable().optional(),
  recipient_focus: z.string().nullable().optional(),
  progression_role: z.string().nullable().optional(),
  cooldown_allowed: z.boolean().optional(),
  closing_allowed: z.boolean().optional(),
  can_follow_heavy: z.boolean().optional(),
  requires_transition_before: z.boolean().optional(),
  avoid_near_repetition: z.boolean().optional(),
  should_not_follow_tags: z.array(z.string()).optional(),
  should_not_precede_tags: z.array(z.string()).optional(),
  requires_couple_unlock: z.boolean().optional(),
  unlock_group_key: z.string().nullable().optional(),
  is_available_in_default: z.boolean().optional(),
  is_available_in_estreia: z.boolean().optional(),
  is_available_in_custom_selection: z.boolean().optional(),
  is_official: z.boolean().optional(),
  admin_only_editable: z.boolean().optional(),
});

export async function GET() {
  const userSession = await getSession();
  if (!userSession?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const cards = await prisma.card.findMany({
    orderBy: [{ deck_id: "asc" }, { position: "asc" }],
    include: { deck: { select: { name: true, type: true } } },
  });

  return NextResponse.json({ cards });
}

export async function PATCH(req: Request) {
  const userSession = await getSession();
  if (!userSession?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id, ...data } = body as { id: string } & Record<string, unknown>;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  try {
    const parsed = patchSchema.parse(data);
    const card = await prisma.card.update({ where: { id }, data: parsed });
    return NextResponse.json({ card });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
