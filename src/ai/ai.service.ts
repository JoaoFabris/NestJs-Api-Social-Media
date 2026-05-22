import { Injectable } from "@nestjs/common";
import Groq from "groq-sdk";

@Injectable()
export class AiService {
  private client: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY não definida");
    }

    this.client = new Groq({ apiKey });
  }
  async suggestCaption(topic: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em redes sociais. Responda APENAS com a legenda, sem explicações.",
        },
        {
          role: "user",
          content: `Crie uma legenda criativa e engajante para um post sobre: "${topic}". Máximo 150 caracteres.`,
        },
      ],
    });

    return response.choices[0].message.content ?? "";
  }

  async chat(message: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `Você é um assistente especialista em redes sociais. 
  Ajude o usuário com dicas de engajamento, horários para postar, ideias de conteúdo e estratégias para crescer nas redes sociais. 
  Seja direto e prático. Máximo 3 parágrafos.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return response.choices[0].message.content ?? "";
  }
}
