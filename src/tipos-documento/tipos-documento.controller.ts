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
import { TiposDocumentoService } from './tipos-documento.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';

@Controller('tipos-documento')
export class TiposDocumentoController {
  constructor(private readonly tiposDocumentoService: TiposDocumentoService) {}

  @Post()
  criar(@Body() dto: CreateTipoDocumentoDto) {
    return this.tiposDocumentoService.criar(dto);
  }

  @Get()
  listar(@Query('incluirInativos') incluirInativos?: string) {
    return this.tiposDocumentoService.listar({ incluirInativos: incluirInativos === 'true' });
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: UpdateTipoDocumentoDto) {
    return this.tiposDocumentoService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async desativar(@Param('id') id: string) {
    await this.tiposDocumentoService.desativar(id);
  }
}
