import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Post } from "../posts/entities/post.entity";
import { FollowsModule } from "../follows/follows.module";
import { FeedService } from "./feed.service";
import { FeedController } from "./feed.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    FollowsModule, // para usar o FollowsService
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
