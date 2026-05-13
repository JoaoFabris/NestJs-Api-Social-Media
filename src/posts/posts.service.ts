import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Post } from "./entities/post.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>, //Repository é a camada responsável por conversar com o banco de dados para uma entidade específica. Esse repository manipula dados da entidade Post.”
    //Ele funciona como uma interface pronta para:
    // salvar dados
    // buscar dados
    // atualizar
    // deletar
    // fazer queries
  ) {}

  // ─── Criar post ───────────────────────────────────────────────
  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      authorId,
    });

    return this.postsRepository.save(post);
  }

  // ─── Listar todos (feed global) ───────────────────────────────
  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ["author"], // carrega os dados do autor junto
      order: { createdAt: "DESC" }, // mais recentes primeiro
    });
  }

  // ─── Buscar por ID ────────────────────────────────────────────
  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!post) {
      throw new NotFoundException("Post não encontrado");
    }

    return post;
  }

  // ─── Buscar posts de um usuário ───────────────────────────────
  async findByUser(authorId: string): Promise<Post[]> {
    return this.postsRepository.find({
      where: { authorId },
      relations: ["author"],
      order: { createdAt: "DESC" },
    });
  }

  // ─── Atualizar ────────────────────────────────────────────────
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const post = await this.findOne(id);

    // apenas o autor pode editar o próprio post
    if (post.authorId !== userId) {
      throw new ForbiddenException(
        "Você não pode editar o post de outro usuário",
      );
    }

    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  // ─── Deletar ──────────────────────────────────────────────────
  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);

    // apenas o autor pode deletar o próprio post
    if (post.authorId !== userId) {
      throw new ForbiddenException(
        "Você não pode deletar o post de outro usuário",
      );
    }

    await this.postsRepository.remove(post);
  }
}
