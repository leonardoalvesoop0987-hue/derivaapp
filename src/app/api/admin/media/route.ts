export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

export async function GET() {
  const userSession = await getSession();
  if (!userSession?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const media = await prisma.mediaAsset.findMany({ orderBy: { created_at: "desc" } });
  return NextResponse.json({ media });
}

export async function PATCH(req: Request) {
  const userSession = await getSession();
  if (!userSession?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const schema = z.object({
    id: z.string(),
    is_active: z.boolean().optional(),
    internal_label: z.string().optional(),
    weight: z.number().int().min(1).max(10).optional(),
    video_category: z.enum(["LESBICO","ORAL_MULHER","FFM","MMF","FACE_FM","OUTRO"]).optional(),
    music_mood: z.enum(["RELAXANTE","SENSUAL","INTENSA"]).optional(),
  });

  try {
    const { id, ...data } = schema.parse(await req.json());
    const asset = await prisma.mediaAsset.update({ where: { id }, data });
    return NextResponse.json({ asset });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
