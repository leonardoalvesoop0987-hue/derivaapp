import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { loginUser } from "@/lib/session";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter no mínimo 3 caracteres"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  p1Name: z.string().min(2, "Nome da Pessoa 1 deve ter no mínimo 2 caracteres"),
  p1Role: z.enum(["WOMAN", "MAN"]),
  p1Email: z.string().email("E-mail da Pessoa 1 inválido").optional().or(z.literal("")),
  p2Name: z.string().min(2, "Nome da Pessoa 2 deve ter no mínimo 2 caracteres"),
  p2Role: z.enum(["WOMAN", "MAN"]),
  p2Email: z.string().email("E-mail da Pessoa 2 inválido").optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { username: parsed.username.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Nome de usuário já está em uso" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: parsed.username.toLowerCase(),
          password_hash: passwordHash,
          participants: {
            create: [
              {
                name: parsed.p1Name,
                role: parsed.p1Role,
                email: parsed.p1Email || null,
              },
              {
                name: parsed.p2Name,
                role: parsed.p2Role,
                email: parsed.p2Email || null,
              },
            ],
          },
        },
      });
      return newUser;
    });

    await loginUser(user.id, user.is_admin);

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
