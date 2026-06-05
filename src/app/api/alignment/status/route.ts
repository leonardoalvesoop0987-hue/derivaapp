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
          select: {
            form_type: true,
            version: true,
            completed_at: true,
          }
        }
      }
    });

    const darkUnlock = await prisma.coupleUnlock.findUnique({
      where: {
        user_id_unlock_group_key: {
          user_id: session.userId,
          unlock_group_key: "DARK_THIRD_IMAGINATION"
        }
      }
    });
    
    const isDarkUnlocked = !!darkUnlock?.is_enabled;

    return NextResponse.json({
      is_dark_unlocked: isDarkUnlocked,
      participants: participants.map(p => {
        const standardResponse = p.responses.find(r => r.form_type === "STANDARD_ALIGNMENT");
        const darkResponse = p.responses.find(r => r.form_type === "DARK_ALIGNMENT");
        
        return {
          id: p.id,
          name: p.name,
          role: p.role,
          standard: {
            has_responded: !!standardResponse,
            last_version: standardResponse?.version || 0,
          },
          dark: {
            has_responded: !!darkResponse,
            last_version: darkResponse?.version || 0,
          }
        };
      })
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
