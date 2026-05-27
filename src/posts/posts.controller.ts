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
  Query,
} from "@nestjs/common";

import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PaginationDto } from "../common/dto/pagination.dto";

@Controller("posts")
@UseGuards(JwtAuthGuard) // todas as rotas de posts exigem login
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // POST /api/v1/posts
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.id);
  }

  // GET /api/v1/posts
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postsService.findAll(paginationDto);
  }

  // GET /api/v1/posts/:id
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  // GET /api/v1/posts/user/:userId
  @Get("user/:userId")
  findByUser(@Param("userId") userId: string) {
    return this.postsService.findByUser(userId);
  }

  // PATCH /api/v1/posts/:id
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(id, updatePostDto, req.user.id);
  }

  // DELETE /api/v1/posts/:id
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string, @Request() req) {
    return this.postsService.remove(id, req.user.id);
  }
}
