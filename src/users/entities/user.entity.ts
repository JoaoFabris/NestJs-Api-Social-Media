import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";

@Entity("users") // nome da tabela no banco
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string; // ID único gerado automaticamente (ex: "a1b2c3...")

  @Column({ unique: true })
  email: string; // não permite dois usuários com o mesmo email

  @Column({ unique: true })
  username: string; // o @handle do usuário

  @Column({ nullable: true })
  website: string;

  @Column()
  @Exclude()
  password: string; //  criptografar isso no Service

  @Column({ nullable: true })
  bio: string; // campo opcional

  @Column({ nullable: true })
  avatarUrl: string; // foto de perfil (opcional)

  @CreateDateColumn()
  createdAt: Date; // preenchido automaticamente na criação

  @UpdateDateColumn()
  updatedAt: Date; // atualizado automaticamente em cada save()
}
