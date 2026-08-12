import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoObrigacaoFiscalDto } from './create-tipo-obrigacao-fiscal.dto';

export class UpdateTipoObrigacaoFiscalDto extends PartialType(CreateTipoObrigacaoFiscalDto) {}
