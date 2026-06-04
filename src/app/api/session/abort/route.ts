import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

const abortSchema = z.object({ sessionId: z.string() });

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = abortSchema.parse(await req.json());

    const session = await prisma.session.findUnique({
      where: { id: sessionId, user_id: userSession.userId },
    });

    if (!session) return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });

    if (session.status !== "ACTIVE") {
      return NextResponse.json({ error: "Sessão já encerrada" }, { status: 400 });
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { status: "ABORTED", ended_at: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
