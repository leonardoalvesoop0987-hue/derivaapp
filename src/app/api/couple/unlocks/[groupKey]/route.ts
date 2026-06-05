import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest, { params }: { params: Promise<{ groupKey: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { groupKey } = await params;

  try {
    const { action } = await req.json(); // 'enable' or 'disable'

    if (action !== 'enable' && action !== 'disable') {
      return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }

    const group = await prisma.unlockGroup.findUnique({
      where: { key: groupKey }
    });

    if (!group) {
      return NextResponse.json({ error: "Grupo de conteúdo não encontrado" }, { status: 404 });
    }

    const is_enabled = action === 'enable';

    const unlock = await prisma.coupleUnlock.upsert({
      where: {
        user_id_unlock_group_key: {
          user_id: session.userId,
          unlock_group_key: groupKey
        }
      },
      update: {
        is_enabled,
        enabled_at: is_enabled ? new Date() : null,
        disabled_at: is_enabled ? null : new Date()
      },
      create: {
        user_id: session.userId,
        unlock_group_key: groupKey,
        is_enabled,
        enabled_at: is_enabled ? new Date() : null
      }
    });

    return NextResponse.json({ success: true, unlock });
  } catch (error) {
    console.error("Error updating couple unlock:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
