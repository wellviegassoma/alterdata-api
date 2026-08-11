import { Injectable } from '@nestjs/common';
import { AlterdataHttpService } from '../client/alterdata-http.service';
import { AlterdataService } from '../client/alterdata-service.enum';
import { JsonApiDocument, buildRelationships, compact } from '../client/json-api.types';
import { CreateAdmissaoDto } from './dto/create-admissao.dto';
import { AdmissaoAttributes } from './admissao.types';

@Injectable()
export class AdmissoesService {
  constructor(private readonly alterdata: AlterdataHttpService) {}

  async criar(dto: CreateAdmissaoDto) {
    const attributes = compact<AdmissaoAttributes>({
      nome: dto.nome,
      cpf: dto.cpf,
      cpfAlfanumerico: dto.cpfAlfanumerico,
      isCpf: dto.isCpf,
      admissao: dto.admissao,
      nomecargo: dto.nomecargo,
      ...dto.atributosAdicionais,
    });

    const relationships = buildRelationships({
      empresa: ['empresas', dto.empresaId],
      statusadmissao: ['tipos-status-admissao', dto.statusAdmissaoId],
      estado: ['estados', dto.estadoId],
      estadocivil: ['tipos-estado-civil', dto.estadoCivilId],
      tipovinculotrabalhista: ['tipos-vinculos-trabalhista', dto.tipoVinculoTrabalhistaId],
      naturalidade: ['estados', dto.naturalidadeId],
      tipoconta: ['tipos-de-conta', dto.tipoContaId],
      tipoadmissao: ['tipos-admissao', dto.tipoAdmissaoId],
      sexo: ['tipos-sexo', dto.sexoId],
      raca: ['tipos-raca', dto.racaId],
      escolaridade: ['tipos-escolaridade', dto.escolaridadeId],
      nacionalidade: ['paises', dto.nacionalidadeId],
      paisnascimento: ['paises', dto.paisNascimentoId],
      pais: ['paises', dto.paisId],
      departamento: ['departamentos', dto.departamentoId],
      funcao: ['funcoes', dto.funcaoId],
      formapagamento: ['tipos-forma-de-pagamento', dto.formaPagamentoId],
      categoriawdp: ['tipos-categoria', dto.categoriaWdpId],
      tipoidentidade: ['tipos-identidade', dto.tipoIdentidadeId],
      ufidentidade: ['estados', dto.ufIdentidadeId],
      ufctps: ['estados', dto.ufCtpsId],
      ufcnh: ['estados', dto.ufCnhId],
      categoriacnh: ['tipos-cnh', dto.categoriaCnhId],
      foto: ['fotos', dto.fotoId],
    });

    return this.alterdata.post<JsonApiDocument<AdmissaoAttributes>>(
      AlterdataService.DP,
      '/api/v1/candidatos',
      { data: { type: 'candidatos', attributes, relationships } },
    );
  }
}
