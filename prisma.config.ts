import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// process.env (não o helper env()) de propósito: `prisma generate` roda no
// build, antes de DATABASE_URL estar necessariamente disponível, e não
// precisa de conexão com o banco — só `migrate deploy`/`migrate dev` usam
// isso de fato. env() lança erro se a variável não existir; process.env não.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
