import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"; // ajuste o path se necessário
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

class SuggestCaptionDto {
  topic: string;
}

@ApiTags("ai")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("caption")
  @ApiOperation({ summary: "Sugere uma legenda para um post" })
  async suggestCaption(@Body() body: SuggestCaptionDto) {
    const caption = await this.aiService.suggestCaption(body.topic);
    return { caption };
  }
}
