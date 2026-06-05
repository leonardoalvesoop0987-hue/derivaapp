import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(req: Request, { params }: { params: Promise<{ coupleId: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { coupleId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: coupleId },
    });

    if (!user) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 });
    }

    const responses = await prisma.privateAlignmentResponse.findMany({
      where: { user_id: coupleId },
      orderBy: { version: 'desc' },
    });

    return NextResponse.json({
      couple: {
        id: user.id,
        username: user.username || user.email,
      },
      responses: responses.map(r => ({
        id: r.id,
        role: r.participant_role,
        form_type: r.form_type,
        version: r.version,
        completed_at: r.completed_at,
        answers: JSON.parse(r.answers_json),
      }))
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
