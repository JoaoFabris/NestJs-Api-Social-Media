import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";

import { Like } from "./entities/like.entity";
import { Post } from "../posts/entities/post.entity";

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  // ─── Curtir post ──────────────────────────────────────────────
  async like(postId: string, userId: string): Promise<{ message: string }> {
    // verifica se o post existe
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException("Post não encontrado");

    // verifica se já curtiu
    const existing = await this.likesRepository.findOne({
      where: { postId, userId },
    });
    if (existing) throw new ConflictException("Você já curtiu este post");

    // salva a curtida e incrementa o contador
    await this.likesRepository.save({ postId, userId });
    await this.postsRepository.increment({ id: postId }, "likesCount", 1);

    return { message: "Post curtido com sucesso" };
  }

  // ─── Descurtir post ───────────────────────────────────────────
  async unlike(postId: string, userId: string): Promise<{ message: string }> {
    const like = await this.likesRepository.findOne({
      where: { postId, userId },
    });
    if (!like) throw new NotFoundException("Você não curtiu este post");

    // remove a curtida e decrementa o contador
    await this.likesRepository.remove(like);
    await this.postsRepository.decrement({ id: postId }, "likesCount", 1);

    return { message: "Curtida removida com sucesso" };
  }

  // ─── Listar quem curtiu ───────────────────────────────────────
  async findByPost(postId: string): Promise<Like[]> {
    return this.likesRepository.find({
      where: { postId },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });
  }
}
