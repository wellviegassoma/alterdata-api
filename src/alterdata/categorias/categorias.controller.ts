import { Controller, Get, Query } from '@nestjs/common';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  listar(@Query('login') login: string) {
    return this.categoriasService.listar(login);
  }
}
