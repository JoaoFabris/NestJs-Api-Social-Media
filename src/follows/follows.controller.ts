import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";

import { FollowsService } from "./follows.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("users/:userId")
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  // POST /api/v1/users/:userId/follow
  @Post("follow")
  @HttpCode(HttpStatus.CREATED)
  follow(@Param("userId") userId: string, @Request() req) {
    return this.followsService.follow(req.user.id, userId);
  }

  // DELETE /api/v1/users/:userId/unfollow
  @Delete("unfollow")
  @HttpCode(HttpStatus.OK)
  unfollow(@Param("userId") userId: string, @Request() req) {
    return this.followsService.unfollow(req.user.id, userId);
  }

  // GET /api/v1/users/:userId/followers
  @Get("followers")
  findFollowers(@Param("userId") userId: string) {
    return this.followsService.findFollowers(userId);
  }

  // GET /api/v1/users/:userId/following
  @Get("following")
  findFollowing(@Param("userId") userId: string) {
    return this.followsService.findFollowing(userId);
  }
}
