# Social Media API

API REST para uma rede social construída com NestJS, PostgreSQL e JWT.

## Tecnologias

- NestJS — framework Node.js
- PostgreSQL — banco de dados relacional
- TypeORM — ORM com migrations
- JWT — autenticação stateless
- Swagger — documentação interativa

## Funcionalidades

- Autenticação com JWT (registro, login)
- CRUD de posts com paginação
- Curtidas e comentários
- Sistema de seguidores
- Feed personalizado

## Documentação

Acesse `/docs` para a documentação interativa via Swagger.

## Rodando localmente

```bash
# instalar dependências
pnpm install

# configurar variáveis de ambiente
cp .env.example .env

# rodar migrations
pnpm run migration:run

# iniciar em desenvolvimento
pnpm run start:dev
```

## Variáveis de ambiente

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_NAME=social_media_db
JWT_SECRET=seu_secret
JWT_EXPIRES_IN=7d
```
