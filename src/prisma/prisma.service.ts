import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/** Prisma 7 exige um driver adapter — não conecta mais via engine embutida. */
function buildAdapter() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não configurado. Defina a connection string do Postgres no .env.');
  }
  return new PrismaPg({ connectionString });
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ adapter: buildAdapter() });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado ao Postgres (Supabase) via Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
