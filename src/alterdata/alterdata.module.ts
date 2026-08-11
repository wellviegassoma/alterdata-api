import { Module } from '@nestjs/common';
import { AlterdataClientModule } from './client/alterdata-client.module';
import { LookupsModule } from './lookups/lookups.module';
import { EmpresasModule } from './empresas/empresas.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { AdmissoesModule } from './admissoes/admissoes.module';
import { FeriasModule } from './ferias/ferias.module';
import { DesligamentosModule } from './desligamentos/desligamentos.module';
import { FolhaPagamentoModule } from './folha-pagamento/folha-pagamento.module';
import { AtendimentosModule } from './atendimentos/atendimentos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CertidoesModule } from './certidoes/certidoes.module';
import { DocumentosModule } from './documentos/documentos.module';
import { EtarefasModule } from './etarefas/etarefas.module';
import { UsuariosModule } from './usuarios/usuarios.module';

/**
 * Agrega todos os módulos de integração com o ePlugin (eContador/Alterdata).
 * Cada submódulo representa uma área da documentação oficial
 * (https://eplugin.pack.alterdata.com.br/).
 */
@Module({
  imports: [
    AlterdataClientModule,
    LookupsModule,
    EmpresasModule,
    FuncionariosModule,
    AdmissoesModule,
    FeriasModule,
    DesligamentosModule,
    FolhaPagamentoModule,
    AtendimentosModule,
    CategoriasModule,
    CertidoesModule,
    DocumentosModule,
    EtarefasModule,
    UsuariosModule,
  ],
})
export class AlterdataModule {}
