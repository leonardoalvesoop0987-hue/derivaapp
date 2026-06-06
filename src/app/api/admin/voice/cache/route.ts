import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function DELETE() {
  const session = await getSession();
  if (!session || !session.isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.cardVoiceAudio.deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
