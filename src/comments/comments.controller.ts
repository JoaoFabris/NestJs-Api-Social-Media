import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";

import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("posts/:postId/comments")
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // POST /api/v1/posts/:postId/comments
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param("postId") postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.create(postId, createCommentDto, req.user.id);
  }

  // GET /api/v1/posts/:postId/comments
  @Get()
  findByPost(@Param("postId") postId: string) {
    return this.commentsService.findByPost(postId);
  }

  // PATCH /api/v1/posts/:postId/comments/:id
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.update(id, updateCommentDto, req.user.id);
  }

  // DELETE /api/v1/posts/:postId/comments/:id
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param("id") id: string,
    @Param("postId") postId: string,
    @Request() req,
  ) {
    return this.commentsService.remove(id, req.user.id, postId);
  }
}
