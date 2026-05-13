import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Exclude } from "class-transformer";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  content: string;

  @Column({ nullable: true })
  imageUrl: string; // imagem opcional no post

  @Column({ default: 0 })
  likesCount: number; // contador de curtidas

  @Column({ default: 0 })
  commentsCount: number; // contador de comentários

  // ─── Relacionamento com User ──────────────────────────────
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author: User; // objeto completo do autor

  @Exclude()
  @Column({ name: "author_id" })
  authorId: string; // só o ID — útil para queries sem precisar do JOIN

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
