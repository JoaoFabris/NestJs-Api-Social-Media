import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SuggestCaptionDto {
  @ApiProperty({
    example: "viagem para Paris",
    description: "Tema do post para gerar a legenda",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  topic: string;
}
