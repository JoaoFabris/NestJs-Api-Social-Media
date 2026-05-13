import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Comment } from "./entities/comment.entity";
import { Post } from "../posts/entities/post.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  // ─── Criar comentário ─────────────────────────────────────────
  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    authorId: string,
  ): Promise<Comment> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException("Post não encontrado");

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      postId,
      authorId,
    });

    await this.commentsRepository.save(comment);
    await this.postsRepository.increment({ id: postId }, "commentsCount", 1);

    const saved = await this.commentsRepository.findOne({
      where: { id: comment.id },
      relations: ["author"],
    });

    if (!saved)
      throw new NotFoundException("Erro ao recuperar comentário criado");

    return saved;
  }
  // ─── Listar comentários de um post ───────────────────────────
  async findByPost(postId: string): Promise<Comment[]> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException("Post não encontrado");

    return this.commentsRepository.find({
      where: { postId },
      relations: ["author"],
      order: { createdAt: "ASC" }, // mais antigos primeiro — ordem de conversa
    });
  }

  // ─── Atualizar comentário ─────────────────────────────────────
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!comment) throw new NotFoundException("Comentário não encontrado");

    if (comment.authorId !== userId) {
      throw new ForbiddenException(
        "Você não pode editar o comentário de outro usuário",
      );
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  // ─── Deletar comentário ───────────────────────────────────────
  async remove(id: string, userId: string, postId: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({ where: { id } });

    if (!comment) throw new NotFoundException("Comentário não encontrado");

    if (comment.authorId !== userId) {
      throw new ForbiddenException(
        "Você não pode deletar o comentário de outro usuário",
      );
    }

    await this.commentsRepository.remove(comment);
    await this.postsRepository.decrement({ id: postId }, "commentsCount", 1);
  }
}
