import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TiposObrigacaoFiscalService } from './tipos-obrigacao-fiscal.service';
import { CreateTipoObrigacaoFiscalDto } from './dto/create-tipo-obrigacao-fiscal.dto';
import { UpdateTipoObrigacaoFiscalDto } from './dto/update-tipo-obrigacao-fiscal.dto';

@Controller('tipos-obrigacao-fiscal')
export class TiposObrigacaoFiscalController {
  constructor(private readonly tiposObrigacaoFiscalService: TiposObrigacaoFiscalService) {}

  @Post()
  criar(@Body() dto: CreateTipoObrigacaoFiscalDto) {
    return this.tiposObrigacaoFiscalService.criar(dto);
  }

  @Get()
  listar(@Query('incluirInativos') incluirInativos?: string) {
    return this.tiposObrigacaoFiscalService.listar({ incluirInativos: incluirInativos === 'true' });
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: UpdateTipoObrigacaoFiscalDto) {
    return this.tiposObrigacaoFiscalService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async desativar(@Param('id') id: string) {
    await this.tiposObrigacaoFiscalService.desativar(id);
  }
}
