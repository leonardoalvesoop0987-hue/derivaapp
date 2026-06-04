import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

const feedbackSchema = z.object({
  sessionId: z.string(),
  cardId: z.string(),
  feedbackType: z.enum(["FAVORITE", "REPEAT", "LATER", "NEVER_AGAIN"]),
});

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { sessionId, cardId, feedbackType } = feedbackSchema.parse(body);

    // Create feedback event
    await prisma.cardFeedback.create({
      data: {
        user_id: userSession.userId,
        card_id: cardId,
        session_id: sessionId,
        feedback_type: feedbackType,
      },
    });

    // Upsert consolidated preference
    await prisma.userCardPreference.upsert({
      where: { user_id_card_id: { user_id: userSession.userId, card_id: cardId } },
      create: {
        user_id: userSession.userId,
        card_id: cardId,
        is_favorite: feedbackType === "FAVORITE",
        is_removed: feedbackType === "NEVER_AGAIN",
        never_again_at: feedbackType === "NEVER_AGAIN" ? new Date() : null,
        favorite_count: feedbackType === "FAVORITE" ? 1 : 0,
        last_feedback_type: feedbackType,
      },
      update: {
        is_favorite: feedbackType === "FAVORITE" ? true : undefined,
        is_removed: feedbackType === "NEVER_AGAIN" ? true : undefined,
        never_again_at: feedbackType === "NEVER_AGAIN" ? new Date() : undefined,
        favorite_count: feedbackType === "FAVORITE" ? { increment: 1 } : undefined,
        last_feedback_type: feedbackType,
        updated_at: new Date(),
      },
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
