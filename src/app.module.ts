import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { PostsModule } from "./posts/posts.module";
import { LikesModule } from "./likes/likes.module";
import { CommentsModule } from "./comments/comments.module";
import { FollowsModule } from "./follows/follows.module";
import { FeedModule } from "./feed/feed.module";
import { envValidationSchema } from "./config/env.validation";
import { dataSourceOptions } from "./config/typeorm.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...dataSourceOptions, // ← reutiliza a config base
        synchronize: config.get("NODE_ENV") === "development",
      }),
    }),

    UsersModule,
    AuthModule,
    PostsModule,
    LikesModule,
    CommentsModule,
    FollowsModule,
    FeedModule,
  ],
})
export class AppModule {}
