import { Controller, Get, Request, UseGuards } from "@nestjs/common";

import { FeedService } from "./feed.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("feed")
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // GET /api/v1/feed
  @Get()
  getFeed(@Request() req) {
    return this.feedService.getFeed(req.user.id);
  }
}
