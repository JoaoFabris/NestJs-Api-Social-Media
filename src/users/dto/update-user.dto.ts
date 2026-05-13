import { PartialType } from '@nestjs/mapped-types'; //PartialType pega todos os campos do CreateUserDto e os torna opcionais — 
// assim o usuário pode atualizar só o que quiser, sem precisar mandar tudo de novo.
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}