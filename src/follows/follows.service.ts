import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Follow } from "./entities/follow.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // ─── Seguir usuário ───────────────────────────────────────────
  async follow(
    followerId: string,
    followingId: string,
  ): Promise<{ message: string }> {
    // não pode seguir a si mesmo
    if (followerId === followingId) {
      throw new BadRequestException("Você não pode seguir a si mesmo");
    }

    // verifica se o usuário a seguir existe
    const following = await this.usersRepository.findOne({
      where: { id: followingId },
    });
    if (!following) throw new NotFoundException("Usuário não encontrado");

    // verifica se já segue
    const existing = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });
    if (existing) throw new ConflictException("Você já segue este usuário");

    await this.followsRepository.save({ followerId, followingId });

    return { message: `Você agora segue ${following.username}` };
  }

  // ─── Deixar de seguir ─────────────────────────────────────────
  async unfollow(
    followerId: string,
    followingId: string,
  ): Promise<{ message: string }> {
    const follow = await this.followsRepository.findOne({
      where: { followerId, followingId },
    });
    if (!follow) throw new NotFoundException("Você não segue este usuário");

    await this.followsRepository.remove(follow);

    return { message: "Você deixou de seguir este usuário" };
  }

  // ─── Listar seguidores de um usuário ─────────────────────────
  async findFollowers(userId: string): Promise<Follow[]> {
    return this.followsRepository.find({
      where: { followingId: userId },
      relations: ["follower"],
      order: { createdAt: "DESC" },
    });
  }

  // ─── Listar quem um usuário segue ────────────────────────────
  async findFollowing(userId: string): Promise<Follow[]> {
    return this.followsRepository.find({
      where: { followerId: userId },
      relations: ["following"],
      order: { createdAt: "DESC" },
    });
  }

  // ─── IDs de quem o usuário segue (usado no feed) ─────────────
  async findFollowingIds(userId: string): Promise<string[]> {
    const follows = await this.followsRepository.find({
      where: { followerId: userId },
    });

    return follows.map((f) => f.followingId);
  }
}
