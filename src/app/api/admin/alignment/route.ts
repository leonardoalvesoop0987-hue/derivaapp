import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersWithParticipants = await prisma.user.findMany({
      include: {
        participants: {
          include: {
            responses: {
              orderBy: { version: 'desc' },
              take: 1,
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const alignments = usersWithParticipants.map(user => {
      let womanVersion = 0;
      let manVersion = 0;
      let womanLastDate = null;
      let manLastDate = null;

      user.participants.forEach(p => {
        const lastResp = p.responses[0];
        if (p.role === "WOMAN") {
          womanVersion = lastResp?.version || 0;
          womanLastDate = lastResp?.completed_at || null;
        } else if (p.role === "MAN") {
          manVersion = lastResp?.version || 0;
          manLastDate = lastResp?.completed_at || null;
        }
      });

      let status = "NENHUM_RESPONDEU";
      if (womanVersion > 0 && manVersion > 0) status = "AMBOS_RESPONDERAM";
      else if (womanVersion > 0) status = "APENAS_FEMININA";
      else if (manVersion > 0) status = "APENAS_MASCULINA";

      return {
        id: user.id,
        username: user.username || user.email, // fallback for legacy
        womanVersion,
        manVersion,
        womanLastDate,
        manLastDate,
        status,
        created_at: user.created_at,
      };
    });

    return NextResponse.json({ alignments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
