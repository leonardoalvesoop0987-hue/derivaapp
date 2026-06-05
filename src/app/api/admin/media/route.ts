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
    video_category: z.enum(["LESBICO","FFM","MMF","MF","ORAL_MULHER","FACE_FM","OUTRO"]).optional().nullable(),
    content_type: z.enum(["ORAL_ONLY","PENETRATION_ONLY","COMPLETE"]).optional().nullable(),
    visual_tags: z.array(z.string()).optional(),
    music_mood: z.enum(["RELAXANTE","SENSUAL","INTENSA"]).optional().nullable(),
  });

  try {
    const { id, ...data } = schema.parse(await req.json());
    const asset = await prisma.mediaAsset.update({ where: { id }, data: data as any });
    return NextResponse.json({ asset });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userSession = await getSession();
  if (!userSession?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    
    // Check if it's used in sessions
    const usageCount = await prisma.sessionVideoOption.count({ where: { media_asset_id: id } });
    if (usageCount > 0) {
      // Soft delete if used
      const asset = await prisma.mediaAsset.update({ where: { id }, data: { is_active: false } });
      return NextResponse.json({ message: "Arquivo em uso no histórico. Foi apenas desativado.", asset });
    }

    // Hard delete
    await prisma.mediaAsset.delete({ where: { id } });
    // Note: To fully delete from R2 we'd need to call R2 delete logic here, 
    // but the instruction says "prefer soft delete/desativação se houver vínculo histórico".
    return NextResponse.json({ message: "Arquivo deletado do banco." });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
