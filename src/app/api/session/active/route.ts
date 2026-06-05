import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const activeSession = await prisma.session.findFirst({
      where: { 
        user_id: userSession.userId, 
        status: "ACTIVE" 
      },
      orderBy: { created_at: "desc" }
    });

    if (activeSession) {
      return NextResponse.json({ 
        hasActiveSession: true, 
        sessionId: activeSession.id 
      });
    }

    return NextResponse.json({ hasActiveSession: false });
  } catch (error) {
    console.error("Error fetching active session:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
