import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

/**
 * Cria (ou atualiza a senha de) o primeiro usuário ADMIN, lendo as
 * credenciais de ADMIN_NOME/ADMIN_EMAIL/ADMIN_SENHA no .env. Rode com:
 *   npx prisma db seed
 */
async function main() {
  const nome = process.env.ADMIN_NOME;
  const email = process.env.ADMIN_EMAIL;
  const senha = process.env.ADMIN_SENHA;

  if (!nome || !email || !senha) {
    throw new Error(
      'Defina ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA no .env antes de rodar o seed.',
    );
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não configurado no .env.');
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  const senhaHash = await bcrypt.hash(senha, 12);

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: { senhaHash, nome, papel: 'ADMIN' },
    create: { nome, email, senhaHash, papel: 'ADMIN' },
  });

  console.log(`Usuário admin pronto: ${usuario.email} (id ${usuario.id})`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
