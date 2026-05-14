import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

// O teste unitário (ou teste unit) é o processo de testar a menor parte isolada de um sistema de forma individual. Na programação, essa menor parte geralmente é uma função, um método ou uma classe.
// O objetivo principal é garantir que essa pequena engrenagem do código funcione exatamente como esperado, livre de dependências externas.

const mockUsersService = {
  findByEmail: jest.fn(),
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue("mock-token"),
};

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ─── validateUser ─────────────────────────────────────────────
  describe("validateUser", () => {
    it("deve retornar o usuário quando as credenciais são válidas", async () => {
      const hashedPassword = await bcrypt.hash("senha123", 10);
      const mockUser = {
        id: "uuid-123",
        email: "joao@email.com",
        password: hashedPassword,
      } as User;

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        "joao@email.com",
        "senha123",
      );

      expect(result).toBeDefined();
      expect(result?.email).toBe("joao@email.com");
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        "joao@email.com",
      );
    });

    it("deve retornar null quando a senha estiver errada", async () => {
      const hashedPassword = await bcrypt.hash("senha123", 10);
      const mockUser = {
        id: "uuid-123",
        email: "joao@email.com",
        password: hashedPassword,
      } as User;

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        "joao@email.com",
        "senha-errada",
      );

      expect(result).toBeNull();
    });

    it("deve retornar null quando o usuário não existir", async () => {
      mockUsersService.findByEmail.mockRejectedValue(new Error("Not found"));

      const result = await authService.validateUser(
        "naoexiste@email.com",
        "senha123",
      );

      expect(result).toBeNull();
    });

    it("deve chamar findByEmail com o email correto", async () => {
      const hashedPassword = await bcrypt.hash("senha123", 10);
      const mockUser = {
        id: "uuid-123",
        email: "joao@email.com",
        password: hashedPassword,
      } as User;

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await authService.validateUser("joao@email.com", "senha123");

      expect(mockUsersService.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        "joao@email.com",
      );
    });

    it("deve retornar null com senha em branco", async () => {
      const hashedPassword = await bcrypt.hash("senha123", 10);
      const mockUser = {
        id: "uuid-123",
        email: "joao@email.com",
        password: hashedPassword,
      } as User;

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateUser("joao@email.com", "");

      expect(result).toBeNull();
    });
  });

  // ─── login ────────────────────────────────────────────────────
  describe("login", () => {
    it("deve retornar access_token e dados do usuário", async () => {
      const mockUser = {
        id: "uuid-123",
        email: "joao@email.com",
        username: "joaosilva",
      } as User;

      const result = await authService.login(mockUser);

      expect(result).toHaveProperty("access_token");
      expect(result).toHaveProperty("user");
      expect(result.user.email).toBe("joao@email.com");
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: "uuid-123",
        email: "joao@email.com",
      });
    });

    it("deve chamar jwtService.sign exatamente uma vez", async () => {
      const mockUser = {
        id: "uuid-123",
        email: "joao@email.com",
        username: "joaosilva",
      } as User;

      await authService.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
    });

    it("o access_token retornado deve ser o token gerado pelo JwtService", async () => {
      const mockUser = {
        id: "uuid-123",
        email: "joao@email.com",
        username: "joaosilva",
      } as User;

      mockJwtService.sign.mockReturnValue("token-especifico");

      const result = await authService.login(mockUser);

      expect(result.access_token).toBe("token-especifico");
    });

    it("o payload do token deve conter sub e email", async () => {
      const mockUser = {
        id: "uuid-456",
        email: "maria@email.com",
        username: "maria",
      } as User;

      await authService.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: "uuid-456",
          email: "maria@email.com",
        }),
      );
    });

    it("os dados do usuário retornados não devem conter a senha", async () => {
      const mockUser = {
        id: "uuid-123",
        email: "joao@email.com",
        username: "joaosilva",
        password: "hash-secreto",
      } as User;

      const result = await authService.login(mockUser);

      expect(result.user).not.toHaveProperty("password");
    });
  });
});
