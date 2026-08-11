import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { REFERENCE_TABLES, ReferenceTableName } from './reference-data.constants';

/**
 * Expõe as tabelas estáticas da seção "Estruturas de Dados" da
 * documentação do ePlugin (estados, tipos de desligamento, bancos, etc.)
 * sem precisar chamar a API da Alterdata a cada consulta.
 */
@Controller('referencia')
export class ReferenceDataController {
  @Get()
  listarTabelas() {
    return Object.keys(REFERENCE_TABLES);
  }

  @Get(':tabela')
  buscarTabela(@Param('tabela') tabela: string) {
    const dados = REFERENCE_TABLES[tabela as ReferenceTableName];
    if (!dados) {
      throw new NotFoundException(
        `Tabela de referência "${tabela}" não encontrada. Use GET /referencia para ver as opções.`,
      );
    }
    return dados;
  }
}
