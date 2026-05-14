import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConflictException, NotFoundException } from "@nestjs/common";

import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";

// O teste unitário (ou teste unit) é o processo de testar a menor parte isolada de um sistema de forma individual. Na programação, essa menor parte geralmente é uma função, um método ou uma classe.
// O objetivo principal é garantir que essa pequena engrenagem do código funcione exatamente como esperado, livre de dependências externas.

const mockUsersRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe("UsersService", () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  // ─── create ───────────────────────────────────────────────────
  describe("create", () => {
    it("deve criar um usuário com sucesso", async () => {
      const createUserDto = {
        email: "joao@email.com",
        username: "joaosilva",
        password: "senha123",
      };

      const mockUser = { id: "uuid-123", ...createUserDto };

      mockUsersRepository.findOne.mockResolvedValue(null);
      mockUsersRepository.create.mockReturnValue(mockUser);
      mockUsersRepository.save.mockResolvedValue(mockUser);

      const result = await usersService.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });

    it("deve lançar ConflictException se email já existir", async () => {
      const createUserDto = {
        email: "joao@email.com",
        username: "joaosilva",
        password: "senha123",
      };

      mockUsersRepository.findOne.mockResolvedValue({ id: "uuid-existente" });

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it("não deve chamar save se o email já existir", async () => {
      const createUserDto = {
        email: "joao@email.com",
        username: "joaosilva",
        password: "senha123",
      };

      mockUsersRepository.findOne.mockResolvedValue({ id: "uuid-existente" });

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });
  });

  // ─── findOne ──────────────────────────────────────────────────
  describe("findOne", () => {
    it("deve retornar o usuário quando encontrado", async () => {
      const mockUser = { id: "uuid-123", email: "joao@email.com" };
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await usersService.findOne("uuid-123");

      expect(result).toBeDefined();
      expect(result.id).toBe("uuid-123");
    });

    it("deve lançar NotFoundException quando não encontrado", async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(usersService.findOne("uuid-inexistente")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("deve chamar findOne com o id correto", async () => {
      const mockUser = { id: "uuid-123", email: "joao@email.com" };
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      await usersService.findOne("uuid-123");

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ id: "uuid-123" }),
        }),
      );
    });
  });

  // ─── findAll ──────────────────────────────────────────────────
  describe("findAll", () => {
    it("deve retornar lista de usuários", async () => {
      const mockUsers = [
        { id: "uuid-1", email: "joao@email.com", username: "joao" },
        { id: "uuid-2", email: "maria@email.com", username: "maria" },
      ];

      mockUsersRepository.find.mockResolvedValue(mockUsers);

      const result = await usersService.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe("joao@email.com");
      expect(mockUsersRepository.find).toHaveBeenCalledTimes(1);
    });

    it("deve retornar array vazio quando não houver usuários", async () => {
      mockUsersRepository.find.mockResolvedValue([]);

      const result = await usersService.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  // ─── update ───────────────────────────────────────────────────
  describe("update", () => {
    it("deve atualizar o usuário com sucesso", async () => {
      const mockUser = {
        id: "uuid-123",
        email: "joao@email.com",
        username: "joaosilva",
        bio: null,
      };

      const updateUserDto = { bio: "Desenvolvedor NestJS" };

      const mockUserAtualizado = { ...mockUser, ...updateUserDto };

      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      mockUsersRepository.save.mockResolvedValue(mockUserAtualizado);

      const result = await usersService.update("uuid-123", updateUserDto);

      expect(result).toBeDefined();
      expect(result.bio).toBe("Desenvolvedor NestJS");
      expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
    });

    it("deve lançar NotFoundException ao tentar atualizar usuário inexistente", async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(
        usersService.update("uuid-inexistente", { bio: "qualquer" }),
      ).rejects.toThrow(NotFoundException);
    });

    it("não deve chamar save se o usuário não existir", async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(
        usersService.update("uuid-inexistente", { bio: "qualquer" }),
      ).rejects.toThrow(NotFoundException);

      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });
  });

  // ─── remove ───────────────────────────────────────────────────
  describe("remove", () => {
    it("deve remover o usuário com sucesso", async () => {
      const mockUser = { id: "uuid-123", email: "joao@email.com" };

      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      mockUsersRepository.remove.mockResolvedValue(mockUser);

      await usersService.remove("uuid-123");

      expect(mockUsersRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(mockUsersRepository.remove).toHaveBeenCalledTimes(1);
    });

    it("deve lançar NotFoundException ao tentar remover usuário inexistente", async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(usersService.remove("uuid-inexistente")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("não deve chamar remove se o usuário não existir", async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(usersService.remove("uuid-inexistente")).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUsersRepository.remove).not.toHaveBeenCalled();
    });
  });
});
