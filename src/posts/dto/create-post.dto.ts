import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
} from "class-validator";

export class CreatePostDto {
  @IsString()
  @MinLength(1, { message: "Post não pode ser vazio" })
  @MaxLength(500, { message: "Post deve ter no máximo 500 caracteres" })
  content: string;

  @IsOptional()
  @IsUrl({}, { message: "Informe uma URL válida para a imagem" })
  imageUrl?: string;
}
