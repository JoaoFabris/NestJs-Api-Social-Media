import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // registra a entidade nesse módulo
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // exporta para outros módulos usarem (ex: AuthModule)
})
export class UsersModule {}