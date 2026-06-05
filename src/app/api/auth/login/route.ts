import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { loginUser } from "@/lib/session";
import { z } from "zod";

const loginSchema = z.object({
  login: z.string().min(1, "Campo obrigatório"),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { login, password } = loginSchema.parse(body);

    const loginLower = login.toLowerCase();

    // Check if it's an email format to do fallback
    const isEmail = loginLower.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: loginLower }
        : { username: loginLower },
    });

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() }
    });

    await loginUser(user.id, user.is_admin);

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
