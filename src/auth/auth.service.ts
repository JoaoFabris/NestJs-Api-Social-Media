import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_CLIENT } from "../supabase/supabase.module";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
    private readonly usersService: UsersService,
  ) {}

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    // 1. Cria o usuário no Supabase Auth
    const { data, error } = await this.supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw new UnauthorizedException(error.message);

    // 2. Cria o perfil público linkado pelo mesmo ID
    return this.usersService.createProfile({
      id: data.user.id,
      email,
      username,
    });
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new UnauthorizedException("Email ou senha incorretos");

    const user = await this.usersService.findByEmail(email);

    return {
      access_token: data.session.access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async me(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }
}
