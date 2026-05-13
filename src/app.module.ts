import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Carrega o .env globalmente em toda a aplicação
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Conecta ao banco usando as variáveis do .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
       // Factory que monta a configuração do banco
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // apenas em desenvolvimento!
        // synchronize: true faz o TypeORM criar/atualizar as tabelas automaticamente. I
        // sso é útil em desenvolvimento, mas em produção vamos usar migrations.
      }),
    }),
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}