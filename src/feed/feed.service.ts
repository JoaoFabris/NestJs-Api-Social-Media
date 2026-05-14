import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

import { Post } from "../posts/entities/post.entity";
import { FollowsService } from "../follows/follows.service";
import { PaginationDto } from "../common/dto/pagination.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly followsService: FollowsService,
  ) {}

  async getFeed(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Post>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit; // ex: página 2 com limit 10 → skip 10

    const followingIds = await this.followsService.findFollowingIds(userId);

    if (followingIds.length === 0) {
      return new PaginatedResponseDto([], 0, page, limit);
    }

    const [posts, total] = await this.postsRepository.findAndCount({
      where: { authorId: In(followingIds) },
      relations: ["author"],
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });

    return new PaginatedResponseDto(posts, total, page, limit);
  }
}
