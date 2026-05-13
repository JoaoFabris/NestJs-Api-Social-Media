import {
  Controller,
  Post,
  Get,
  Request,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/v1/auth/login
  @UseGuards(LocalAuthGuard) //Ativa a LocalStrategy, que pega email e password do body, busca o usuário no banco e compara a senha com bcrypt.
  // Se passar, injeta o usuário no req.user e libera a rota. Se falhar, retorna 401.
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() _loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  // GET /api/v1/auth/me
  @UseGuards(JwtAuthGuard) //usado em todas as rotas protegidas3
  //Ativa a JwtStrategy, que extrai o token do header Authorization: Bearer <token>, verifica a assinatura com o JWT_SECRET e checa se não expirou.
  // Se válido, injeta o payload decodificado no req.user e libera a rota.
  @Get('me')
  async me(@Request() req) {
    return this.authService.me(req.user.id);
  }
}
