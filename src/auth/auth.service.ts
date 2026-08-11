import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.usersService.buscarPorEmailComSenha(email);
    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload: JwtPayload = { sub: usuario.id, email: usuario.email, papel: usuario.papel };
    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    };
  }
}
