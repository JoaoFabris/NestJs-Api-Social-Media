import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  // Aplicação
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  // Banco de dados
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(), // mínimo 32 caracteres
  JWT_EXPIRES_IN: Joi.string().default("7d"),
});
