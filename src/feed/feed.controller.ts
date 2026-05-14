import { Controller, Get, Request, Query, UseGuards } from "@nestjs/common";

import { FeedService } from "./feed.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PaginationDto } from "../common/dto/pagination.dto";

@Controller("feed")
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  // GET /api/v1/feed?page=1&limit=10
  @Get()
  getFeed(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.feedService.getFeed(req.user.id, paginationDto);
  }
}
