import { PapelUsuario } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  papel: PapelUsuario;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  papel: PapelUsuario;
}
