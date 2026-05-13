import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';


@Controller('users') export class UsersController { // o '@' é um decorator.
//  “Essa classe é um controller HTTP.” Essa classe participa do sistema HTTP
    constructor(private readonly usersService: UsersService) {}

  // POST /api/v1/users
  @Post()
  @HttpCode(HttpStatus.CREATED) // retorna 201 em vez de 200
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // GET /api/v1/users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /api/v1/users/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // PATCH /api/v1/users/:id
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // DELETE /api/v1/users/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // retorna 204 (sem body) quando deletar
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}