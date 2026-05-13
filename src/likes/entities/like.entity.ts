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
import { Post } from "../../posts/entities/post.entity";
import { Exclude } from "class-transformer";

@Entity("likes")
@Unique(["userId", "postId"]) // ← um usuário só pode curtir um post uma vez
export class Like {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Exclude()
  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => Post, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @Exclude()
  @Column({ name: "post_id" })
  postId: string;

  @CreateDateColumn()
  createdAt: Date;
}
