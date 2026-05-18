import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { StorageService } from "src/storage/storage.service";

//"essa classe pode ser gerenciada pelo sistema de injeção de dependências".
//  Sem ele, se outro lugar tentar usar o UsersService no constructor, o NestJS vai lançar um erro porque não sabe como criar essa instância.
@Injectable()
// o '@' é um decorator.
export class UsersService {
  constructor(
    //O TypeORM registra um repositório para cada entidade. Esse decorator diz: "quero o repositório específico da entidade User".
    //  O NestJS então injeta um objeto Repository<User> pronto pra uso — você nunca instancia isso manualmente.
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly storageService: StorageService,
  ) {}

  //Criar um user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;

    // Verifica se email ou username já existem
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException("Email ou username já está em uso");
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }
  // ─── Buscar todos ────────────────────────────────────────────
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // ─── Buscar por ID ───────────────────────────────────────────
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    return user;
  }

  // ─── Buscar por email (usado no Auth depois) ─────────────────
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();

    if (!user) {
      throw new NotFoundException("Credenciais inválidas");
    }

    return user;
  }

  // ─── Atualizar ───────────────────────────────────────────────
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // já lança 404 se não existir

    // Se estiver atualizando a senha, criptografa de novo
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  // ─── Deletar ─────────────────────────────────────────────────
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id); // já lança 404 se não existir
    await this.usersRepository.remove(user);
  }

  async updateAvatar(id: string, file: Express.Multer.File): Promise<User> {
    const user = await this.findOne(id);

    // Monta um caminho único por usuário — sobrescreve sempre o mesmo arquivo
    // ex: "avatars/user-abc123/avatar.png"
    const path = `user-${id}/avatar.${file.originalname.split(".").pop()}`;

    const url = await this.storageService.uploadFile("avatars", path, file);

    user.avatarUrl = url;
    return this.usersRepository.save(user);
  }
}
