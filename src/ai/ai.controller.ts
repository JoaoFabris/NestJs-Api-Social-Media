import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SuggestCaptionDto } from "./dto/suggest-caption.dto"; // 👈 import separado
import { ChatDto } from "./dto/chat-bot.dto";

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

  @Post("chat")
  @ApiOperation({ summary: "Chatbot de dicas para redes sociais" })
  async chat(@Body() body: ChatDto) {
    const reply = await this.aiService.chat(body.message);
    return { reply };
  }
}
