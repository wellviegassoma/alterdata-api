export interface JsonApiResourceIdentifier {
  type: string;
  id: string;
}

export interface JsonApiRelationship {
  data: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null;
}

export interface JsonApiResource<A = Record<string, unknown>> {
  id?: string;
  type: string;
  attributes?: A;
  relationships?: Record<string, JsonApiRelationship>;
  links?: Record<string, unknown>;
}

export interface JsonApiLinks {
  self?: string;
  first?: string;
  last?: string;
  next?: string | null;
  prev?: string | null;
  related?: string;
}

export interface JsonApiDocument<A = Record<string, unknown>> {
  data: JsonApiResource<A> | JsonApiResource<A>[];
  included?: JsonApiResource[];
  links?: JsonApiLinks;
  meta?: {
    totalResourceCount?: number;
    [key: string]: unknown;
  };
}

/**
 * Constrói um relationship JSON:API a partir de um type e um id.
 * Retorna undefined quando o id não foi informado, para permitir
 * montar objetos de relationships apenas com os campos preenchidos.
 */
export function toRelationship(
  type: string,
  id: string | number | undefined | null,
): JsonApiRelationship | undefined {
  if (id === undefined || id === null || id === '') {
    return undefined;
  }
  return { data: { type, id: String(id) } };
}

/**
 * Monta um objeto `relationships` do JSON:API a partir de um mapa
 * `{ nomeDoCampo: [type, id] }`, descartando entradas sem id.
 */
export function buildRelationships(
  map: Record<string, [type: string, id: string | number | undefined | null]>,
): Record<string, JsonApiRelationship> {
  const relationships: Record<string, JsonApiRelationship> = {};
  for (const [field, [type, id]] of Object.entries(map)) {
    const relationship = toRelationship(type, id);
    if (relationship) {
      relationships[field] = relationship;
    }
  }
  return relationships;
}

/**
 * Remove chaves com valor undefined de um objeto de atributos,
 * para não enviar campos vazios ao ePlugin.
 */
export function compact<T extends Record<string, unknown>>(attributes: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      (result as Record<string, unknown>)[key] = value;
    }
  }
  return result;
}
