import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await req.json();
    
    const deck = await prisma.deck.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type,
        is_active: data.is_active,
        is_default: data.is_default,
        requires_couple_unlock: data.requires_couple_unlock,
        unlock_group_key: data.unlock_group_key || null,
        cover_style: data.cover_style,
        back_design: data.back_design,
      }
    });
    return NextResponse.json({ deck });
  } catch (error) {
    console.error("Error updating admin deck:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
