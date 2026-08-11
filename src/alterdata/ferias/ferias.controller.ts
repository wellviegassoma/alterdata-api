import { Body, Controller, Post } from '@nestjs/common';
import { FeriasService } from './ferias.service';
import { CreateAgendamentoFeriasDto } from './dto/create-agendamento-ferias.dto';

@Controller('ferias')
export class FeriasController {
  constructor(private readonly feriasService: FeriasService) {}

  @Post('agendamentos')
  agendar(@Body() dto: CreateAgendamentoFeriasDto) {
    return this.feriasService.agendar(dto);
  }
}
