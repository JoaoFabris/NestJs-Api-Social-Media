import { IsString, MinLength, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: "Comentário não pode ser vazio" })
  @MaxLength(300, { message: "Comentário deve ter no máximo 300 caracteres" })
  content: string;
}
