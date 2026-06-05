import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { alignmentQuestionsVersion, darkAlignmentQuestionsVersion } from "@/lib/deriva/alignment-questions";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { participantId, answers, formType = "STANDARD_ALIGNMENT" } = body;

    if (!participantId || !answers) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Verify participant belongs to user
    const participant = await prisma.coupleParticipant.findUnique({
      where: { id: participantId },
    });

    if (!participant || participant.user_id !== session.userId) {
      return NextResponse.json({ error: "Participante inválido" }, { status: 403 });
    }

    // Get current version for this specific form type
    const lastResponse = await prisma.privateAlignmentResponse.findFirst({
      where: { 
        participant_id: participant.id,
        form_type: formType
      },
      orderBy: { version: 'desc' },
    });

    const newVersion = (lastResponse?.version || 0) + 1;
    
    const isDark = formType === "DARK_ALIGNMENT";
    const questionsVer = isDark ? darkAlignmentQuestionsVersion : alignmentQuestionsVersion;

    const answersJson = JSON.stringify({
      formType: formType,
      unlockGroup: isDark ? "DARK_THIRD_IMAGINATION" : undefined,
      audience: participant.role.toLowerCase(),
      questionsVersion: questionsVer,
      submittedAt: new Date().toISOString(),
      answers,
    });

    await prisma.privateAlignmentResponse.create({
      data: {
        user_id: session.userId,
        participant_id: participant.id,
        participant_role: participant.role,
        form_type: formType,
        version: newVersion,
        questions_version: questionsVer,
        answers_json: answersJson,
        completed_at: new Date(),
      }
    });

    return NextResponse.json({ success: true, version: newVersion });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
