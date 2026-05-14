import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";

config(); // carrega o .env

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
  synchronize: false, // nunca true aqui // apenas em desenvolvimento o uso do true!
  // synchronize: true faz o TypeORM criar/atualizar as tabelas automaticamente. I
  // sso é útil em desenvolvimento, mas em produção vamos usar migrations.
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
