import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

import { Post } from "../posts/entities/post.entity";
import { FollowsService } from "../follows/follows.service";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly followsService: FollowsService,
  ) {}

  async getFeed(userId: string): Promise<Post[]> {
    // busca os IDs de todos que o usuário segue
    const followingIds = await this.followsService.findFollowingIds(userId);

    // se não segue ninguém retorna feed vazio
    if (followingIds.length === 0) return [];

    // busca posts apenas dessas pessoas
    return this.postsRepository.find({
      where: { authorId: In(followingIds) },
      relations: ["author"],
      order: { createdAt: "DESC" },
    });
  }
}
