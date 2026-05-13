import { PartialType } from "@nestjs/mapped-types"; //O PartialType() pega todas as propriedades de uma classe e transforma em opcionais.
import { CreatePostDto } from "./create-post.dto";

export class UpdatePostDto extends PartialType(CreatePostDto) {}
