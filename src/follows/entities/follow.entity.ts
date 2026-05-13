import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Exclude } from "class-transformer";

@Entity("follows")
@Unique(["followerId", "followingId"]) // um usuário só pode seguir outro uma vez
export class Follow {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // quem está seguindo
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "follower_id" })
  follower: User;

  @Exclude()
  @Column({ name: "follower_id" })
  followerId: string;

  // quem está sendo seguido
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "following_id" })
  following: User;

  @Exclude()
  @Column({ name: "following_id" })
  followingId: string;

  @CreateDateColumn()
  createdAt: Date;
}
