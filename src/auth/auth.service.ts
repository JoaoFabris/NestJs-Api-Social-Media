import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Chamado pela LocalStrategy no login
  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      console.log("=== validateUser chamado ===");
      console.log("email recebido:", email);
      console.log("password recebido:", password);

      const user = await this.usersService.findByEmail(email);
      console.log("usuário encontrado:", user ? "SIM" : "NÃO");
      console.log("password no banco:", user?.password);

      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log("senha confere:", passwordMatch);

      if (!passwordMatch) return null;

      return user;
    } catch (err) {
      console.log("erro no validateUser:", err.message);
      return null;
    }
  }

  // Chamado pelo Controller após o login ser validado
  async login(user: User) {
    // payload é o que fica dentro do token
    const payload = {
      sub: user.id, // "sub" é a convenção JWT para o ID do dono do token
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  // Retorna o perfil do usuário logado (usado na rota /auth/me)
  async me(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }
}
