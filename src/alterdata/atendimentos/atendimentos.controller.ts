import { Body, Controller, Post } from '@nestjs/common';
import { AtendimentosService } from './atendimentos.service';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';

@Controller('atendimentos')
export class AtendimentosController {
  constructor(private readonly atendimentosService: AtendimentosService) {}

  @Post()
  abrir(@Body() dto: CreateAtendimentoDto) {
    return this.atendimentosService.abrir(dto);
  }
}
