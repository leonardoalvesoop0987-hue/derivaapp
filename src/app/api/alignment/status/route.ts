import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const participants = await prisma.coupleParticipant.findMany({
      where: { user_id: session.userId },
      include: {
        responses: {
          orderBy: { version: 'desc' },
          take: 1,
          select: {
            version: true,
            completed_at: true,
          }
        }
      }
    });

    return NextResponse.json({
      participants: participants.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role,
        has_responded: p.responses.length > 0,
        last_version: p.responses[0]?.version || 0,
      }))
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
