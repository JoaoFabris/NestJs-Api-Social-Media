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

import { LikesService } from "./likes.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("posts/:postId/likes")
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // POST /api/v1/posts/:postId/likes
  @Post()
  @HttpCode(HttpStatus.CREATED)
  like(@Param("postId") postId: string, @Request() req) {
    return this.likesService.like(postId, req.user.id);
  }

  // DELETE /api/v1/posts/:postId/likes
  @Delete()
  @HttpCode(HttpStatus.OK)
  unlike(@Param("postId") postId: string, @Request() req) {
    return this.likesService.unlike(postId, req.user.id);
  }

  // GET /api/v1/posts/:postId/likes
  @Get()
  findByPost(@Param("postId") postId: string) {
    return this.likesService.findByPost(postId);
  }
}
