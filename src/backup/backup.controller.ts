import { Controller, Get } from '@nestjs/common';
import { PapelUsuario } from '@prisma/client';
import { BackupService } from './backup.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get()
  @Roles(PapelUsuario.ADMIN)
  gerar() {
    return this.backupService.gerar();
  }
}
