import { NestFactory } from "@nestjs/core"; //criar aplicação, inicializar módulos e servidor HTTP e sobe a API //  motor que liga aplicação
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common"; //intercepta dados, transforma, valida
import { AppModule } from "./app.module"; //Importa módulo raiz da aplicação.
import { Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

//Função principal da aplicação.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global para todas as rotas: /api/v1/...
  app.setGlobalPrefix("api/v1");

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); //esse interceptor garante que a senha nunca vai aparecer nas respostas da API, automaticamente em toda a aplicação.

  // Ativa a validação automática dos DTOs em toda a aplicação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // retorna erro se vier campo desconhecido
      transform: true, // converte tipos automaticamente (ex: string → number)
    }),
  );

  // ─── Swagger ──────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle("Social Media API")
    .setDescription("Documentação da API de mídia social")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Aplicação:  http://localhost:${port}/api/v1`);
  console.log(`Swagger:    http://localhost:${port}/docs`);
}

bootstrap();

// Lê AppModule
//    ↓
// Carrega módulos
//    ↓
// Cria providers
//    ↓
// Resolve dependências
//    ↓
// Cria controllers
//    ↓
// Inicializa Express/Fastify
