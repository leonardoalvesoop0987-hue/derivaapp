import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function ensureAdmin() {
  const email = "leoalvespak@gmail.com";
  const plainPassword = "Agepen18";
  
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        is_admin: true,
        password_hash: passwordHash, // Garante que a senha seja resetada caso esteja errada
      },
    });
    console.log(`Admin atualizado: ${email}`);
  } else {
    await prisma.user.create({
      data: {
        email,
        password_hash: passwordHash,
        is_admin: true,
      },
    });
    console.log(`Admin criado: ${email}`);
  }
}

ensureAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
