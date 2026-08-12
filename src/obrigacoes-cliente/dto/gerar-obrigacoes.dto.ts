import { Matches } from 'class-validator';

export class GerarObrigacoesDto {
  /** "YYYY-MM" — mês de referência usado pra gerar as obrigações mensais e checar as anuais. */
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, { message: 'competencia precisa estar no formato YYYY-MM' })
  competencia!: string;
}
