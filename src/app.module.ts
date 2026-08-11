import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import alterdataConfig from './config/alterdata.config';
import { AlterdataModule } from './alterdata/alterdata.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [alterdataConfig],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AlterdataModule,
    ClientesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
