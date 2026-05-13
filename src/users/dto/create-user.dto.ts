import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateUserDto {

  @IsEmail({}, { message: 'Informe um email válido' })
  email: string;

  @IsString()
  @MinLength(3, { message: 'Username deve ter no mínimo 3 caracteres' })
  @MaxLength(30, { message: 'Username deve ter no máximo 30 caracteres' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  bio?: string;
}