import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const unlocks = await prisma.coupleUnlock.findMany({
      where: { user_id: session.userId },
      include: { unlock_group: true }
    });

    const groups = await prisma.unlockGroup.findMany({
      where: { is_active: true }
    });

    // Format response: combine active groups with user unlocks
    const result = groups.map(group => {
      const unlock = unlocks.find(u => u.unlock_group_key === group.key);
      return {
        key: group.key,
        title: group.title,
        description: group.description,
        is_enabled: unlock ? unlock.is_enabled : false,
        enabled_at: unlock ? unlock.enabled_at : null
      };
    });

    return NextResponse.json({ unlocks: result });
  } catch (error) {
    console.error("Error fetching couple unlocks:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
