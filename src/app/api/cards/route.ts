import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const userSession = await getSession();
  if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const unlocks = await prisma.coupleUnlock.findMany({
      where: { user_id: userSession.userId, is_enabled: true }
    });
    const unlockedKeys = unlocks.map(u => u.unlock_group_key);

    const cards = await prisma.card.findMany({
      where: { 
        is_active: true,
        is_available_in_custom_selection: true,
        OR: [
          { requires_couple_unlock: false },
          { unlock_group_key: { in: unlockedKeys } }
        ]
      },
      orderBy: [
        { category: 'asc' },
        { intensity: 'asc' }
      ]
    });

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
