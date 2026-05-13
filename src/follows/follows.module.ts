import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Follow } from "./entities/follow.entity";
import { User } from "../users/entities/user.entity";
import { FollowsService } from "./follows.service";
import { FollowsController } from "./follows.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [FollowsService], // exporta para o FeedModule usar
})
export class FollowsModule {}
