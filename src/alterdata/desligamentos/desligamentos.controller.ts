import { Body, Controller, Post } from '@nestjs/common';
import { DesligamentosService } from './desligamentos.service';
import { CreateDesligamentoDto } from './dto/create-desligamento.dto';

@Controller('desligamentos')
export class DesligamentosController {
  constructor(private readonly desligamentosService: DesligamentosService) {}

  @Post()
  criar(@Body() dto: CreateDesligamentoDto) {
    return this.desligamentosService.criar(dto);
  }
}
