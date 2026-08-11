import { Body, Controller, Post } from '@nestjs/common';
import { AdmissoesService } from './admissoes.service';
import { CreateAdmissaoDto } from './dto/create-admissao.dto';

@Controller('admissoes')
export class AdmissoesController {
  constructor(private readonly admissoesService: AdmissoesService) {}

  @Post()
  criar(@Body() dto: CreateAdmissaoDto) {
    return this.admissoesService.criar(dto);
  }
}
