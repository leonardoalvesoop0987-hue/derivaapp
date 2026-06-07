const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function main() {
  let connectionString = process.env.DATABASE_URL || '';
  if (connectionString.startsWith('prisma+postgres://localhost')) {
    connectionString = 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable';
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = 'leoalvespak@gmail.com';
  const password = 'Agepen18';
  
  const hash = bcrypt.hashSync(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password_hash: hash,
      is_admin: true,
    },
    create: {
      email,
      username: 'leoalvespak',
      password_hash: hash,
      is_admin: true,
    },
  });
  
  console.log('Admin user updated/created successfully:', user.email);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
