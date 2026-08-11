import { Body, Controller, Post } from '@nestjs/common';
import { FolhaPagamentoService } from './folha-pagamento.service';
import { CreateMovimentoDto } from './dto/create-movimento.dto';

@Controller('folha-pagamento')
export class FolhaPagamentoController {
  constructor(private readonly folhaPagamentoService: FolhaPagamentoService) {}

  @Post('movimentos')
  incluirMovimento(@Body() dto: CreateMovimentoDto) {
    return this.folhaPagamentoService.incluirMovimento(dto);
  }
}
