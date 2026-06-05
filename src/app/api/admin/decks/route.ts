import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const decks = await prisma.deck.findMany({
      where: { type: { in: ['SYSTEM', 'OFFICIAL'] } },
      orderBy: { created_at: 'asc' },
      include: {
        _count: { select: { cards: true } }
      }
    });
    return NextResponse.json({ decks });
  } catch (error) {
    console.error("Error fetching admin decks:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user?.is_admin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const deck = await prisma.deck.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type || 'OFFICIAL',
        is_active: data.is_active ?? true,
        is_default: data.is_default ?? false,
        requires_couple_unlock: data.requires_couple_unlock ?? false,
        unlock_group_key: data.unlock_group_key || null,
        cover_style: data.cover_style || null,
        back_design: data.back_design || null,
        created_by_admin_id: user.id
      }
    });
    return NextResponse.json({ deck });
  } catch (error) {
    console.error("Error creating admin deck:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
