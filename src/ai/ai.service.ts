import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não definida");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async suggestCaption(topic: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "Você é um especialista em redes sociais. Responda APENAS com a legenda, sem explicações.",
    });

    const result = await model.generateContent(
      `Crie uma legenda criativa e engajante para um post sobre: "${topic}". Máximo 150 caracteres.`,
    );

    const content = result.response.text();

    if (!content) {
      throw new Error("Resposta vazia do Gemini");
    }

    return content;
  }
}
