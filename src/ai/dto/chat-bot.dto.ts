import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChatDto {
  @ApiProperty({
    example: " Me dicas de post que estão viralizando no momento",
    description: "Tema utilizado pela IA para gerar sugestões post e trends",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  message: string;
}
